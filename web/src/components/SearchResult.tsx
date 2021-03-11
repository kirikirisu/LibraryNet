// webバーションでは、ユーザーが自分の持っている本を探して、同じ本を見つける必要がある。
// ユーザーが入力したキーワードによって本を検索するため、頻繁にAPIを叩く可能性がある。
// そのため、SWRでクライアントサイドでデータを取得する。
import useSWR from 'swr'
import axios from 'axios'
import React from 'react'

interface SearchResultProps {
  keyword: string
}

const fetcher = url => axios.get(url).then(res => res.data)

const SR: React.FC<SearchResultProps> = ({ keyword }) => {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${keyword}&startIndex=0&maxResults=1`
  const { data, error } = useSWR(url, fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  console.log("fetch data", data)

  return (
    <div>k</div>
  );
}

export const SearchResult = React.memo(SR);
