// this handler need https
// slackのメッセージで送ったボタンを押した時の処理
import axios from 'axios'
import {Request, Response} from 'express'

export const slack = async(req: Request, res: Response) => {
  const payload = req.body.payload
  if (!payload) return "can not reseive slack action payload"

  const sr = JSON.parse(payload)
  const url = sr.response_url;
  const { value } = sr.actions[0]
  console.log("available",value)

  const headers = {
    'Content-Type': 'application/json',
  }

  // ボタンをメッセージに更新する
  const data = {
    "replace_original": "true",
    "text": "done!!!"
  }

  const { status } = await axios({
    method: 'post',
    url,
    headers,
    data
  })
  console.log("status", status)
  return "Ok, sucsess"
}
