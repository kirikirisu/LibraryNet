import DataLoader from 'dataloader'
import { SharedBook } from '../entities/SharedBook'

 // それぞれのbookIdsにそれぞれのsubscriberaidが対応している必要がある。
// TODO: 返り値と引数の配列の順番が同じになるかテストする
const batchSharedBooks = async(bookIds: number[]) => {
    const sharedBooks = await SharedBook.findByIds(bookIds)
    // console.log("sharedBooks", sharedBooks)

    const subscriberIds: number[] = []
    sharedBooks.forEach((shared) => {
      subscriberIds.push(shared.subscriberId)
    })
    // console.log("subscriberIds",subscriberIds)

    return subscriberIds
}

export const createSharedBookLoader = () => new DataLoader((ids) => batchSharedBooks(ids as number[]))
