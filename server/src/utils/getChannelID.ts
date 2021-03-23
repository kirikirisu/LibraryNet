import axios from 'axios'

export const getChannelID = async(pubID: string, subID: string) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': process.env.SLACK_API_KEY
    }

    const data = {
      users: [pubID, subID]
    }

    const { data: resData } = await axios({
      method: 'post',
      url:'https://slack.com/api/conversations.open',
      headers,
      data
   })

   console.log("openCnverstationRes", resData.channel.id)

  return resData.channel.id
}
