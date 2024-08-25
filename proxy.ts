import { proxySchema } from 'better-sqlite3-proxy'
import { db } from './db'

export type NoticeDate = {
  id?: null | number
  date: string
}

export type Notice = {
  id?: null | number
  date: string
  type: ('amber')
  start_no: number
  start_time: string
  end_no: null | number
  end_time: null | string
}

export type DBProxy = {
  notice_date: NoticeDate[]
  notice: Notice[]
}

export let proxy = proxySchema<DBProxy>({
  db,
  tableFields: {
    notice_date: [],
    notice: [],
  },
})
