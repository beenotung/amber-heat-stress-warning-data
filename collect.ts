import { d2, toDateString } from 'cast.ts'
import { chromium } from 'playwright'
import { count, find, update } from 'better-sqlite3-proxy'
import { proxy } from './proxy'
import { DAY } from '@beenotung/tslib/time'

async function main() {
  let browser = await chromium.launch({ headless: false })
  let page = await browser.newPage()

  let date = new Date('2023-01-01')
  date.setHours(0, 0, 0, 0)

  let today = new Date()
  today.setHours(0, 0, 0, 0)
  for (; date.getTime() < today.getTime(); ) {
    process.stdout.write(`\r date: ${toDateString(date)}`)
    await collectList(date)
    date.setTime(date.getTime() + DAY)
  }
  process.stdout.write(`\n`)

  async function collectList(date: Date) {
    let date_str = toDateString(date)

    if (count(proxy.notice_date, { date: date_str })) {
      return
    }

    let y = date.getFullYear()
    let m = d2(date.getMonth() + 1)
    let d = d2(date.getDate())
    let url = `https://www.info.gov.hk/gia/wr/${y}${m}/${d}.htm`
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    let notices = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll<HTMLAnchorElement>('li a.NEW'),
        a => {
          // e.g. `https://www.info.gov.hk/gia/wr/202408/01/P2024080100759.htm`
          let link = a.href

          // 'Labour Department Notification No.002 - Amber Heat Stress at Work Warning in force'
          // 'Labour Department Notification No.006 - Cancellation of Heat Stress at Work Warning'
          let title = a.innerText

          let no = +title.match(/No\.\s?(\d+)/i)?.[1]!

          const type = title.includes(
            'Amber Heat Stress at Work Warning in force',
          )
            ? ('Amber Start' as const)
            : title.includes('Cancellation of Heat Stress at Work Warning')
            ? ('Amber End' as const)
            : null

          return {
            no,
            link,
            title,
            type,
          }
        },
      )
    })
    notices.reverse()
    for (let notice of notices) {
      switch (notice.type) {
        case 'Amber Start': {
          count(proxy.notice, {
            date: date_str,
            type: 'amber',
            start_no: notice.no,
          }) ||
            proxy.notice.push({
              date: date_str,
              type: 'amber',
              start_no: notice.no,
              start_time: await collectDetail(notice.link),
              end_no: null,
              end_time: null,
            })
          break
        }
        case 'Amber End': {
          let row = find(proxy.notice, {
            date: date_str,
            type: 'amber',
            end_no: null,
          })
          if (row) {
            update(proxy.notice, row.id!, {
              end_no: notice.no,
              end_time: await collectDetail(notice.link),
            })
          }

          break
        }
        default:
          break
      }
    }

    count(proxy.notice_date, { date: date_str }) ||
      proxy.notice_date.push({ date: date_str })
  }

  async function collectDetail(url: string) {
    // e.g. 'The Amber Heat Stress at Work Warning is in force as of 11.40 AM today (Aug 23),'
    // e.g. 'The Heat Stress at Work Warning has been cancelled at 01.40 PM today (Aug 23).'
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    let time = await page.evaluate(() => {
      // e.g. "11.40 AM"
      // e.g. "01.40 PM"
      let match = document
        .querySelector<HTMLElement>('#pressrelease')
        ?.innerText.match(/(\d+)\.(\d+) ([AP]M) today/i)
      if (!match) {
        throw new Error('failed to find time of amber notice')
      }
      let hour = +match[1] % 12
      let minute = +match[2]
      if (match[3].toUpperCase() == 'PM') {
        hour += 12
      }
      return { hour, minute }
    })
    return d2(time.hour) + ':' + d2(time.minute)
  }

  // throw new Error('TODO')

  await page.close()
  await browser.close()
}
main().catch(e => console.error(e))
