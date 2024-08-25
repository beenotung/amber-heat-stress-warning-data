import { d2 } from 'cast.ts'
import { db } from './db'
import { proxy } from './proxy'

let rows = db
  .prepare<void[], { id: number; end_time: string }>(
    /* sql */ `
select id, end_time from notice
where end_time like '12%' or end_time like '24%'
`,
  )
  .all()

for (let row of rows) {
  let parts = row.end_time.split(':')
  parts[0] = d2(+parts[0] - 12).toString()
  proxy.notice[row.id].end_time = parts.join(':')
}
