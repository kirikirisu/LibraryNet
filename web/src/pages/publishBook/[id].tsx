// このページでは、SSRをする。
// apolloのqueryによるフェッチをサーバサイドで実行するわけではなく、
// google books apiをサーバサイドで実行する。
// そのため、普通にgetServerSidePropsを使う。
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'

const BOOKS_API_BASE_URL = "https://www.googleapis.com/books/v1/volumes/";

const PublishBook = ({ book }: any) => {
  const router = useRouter()
  const stringId = router.query.id;
  console.log("book", book)

  return (<div>{stringId}</div>)
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query
  const res = await fetch(BOOKS_API_BASE_URL + id)
  const book = await res.json()

  return {
    props: {
      book,
    }
  }
}

export default PublishBook;
