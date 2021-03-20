import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  librarys?: Maybe<Array<Library>>;
  books: Array<Book>;
  book?: Maybe<Book>;
};


export type QueryBooksArgs = {
  id: Scalars['Int'];
};


export type QueryBookArgs = {
  id: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  organization: Scalars['Boolean'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  hasLibrary?: Maybe<Scalars['Boolean']>;
};

export type Library = {
  __typename?: 'Library';
  id: Scalars['Float'];
  title: Scalars['String'];
  description: Scalars['String'];
  icon: Scalars['String'];
  adminId: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Book = {
  __typename?: 'Book';
  id: Scalars['Float'];
  title: Scalars['String'];
  description: Scalars['String'];
  img: Scalars['String'];
  inforLink: Scalars['String'];
  available: Scalars['String'];
  ownerId: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  subscriberId?: Maybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  createLibrary: LibraryResponse;
  publishBook: BookResponse;
  subscribeBook: SubscribeResponse;
};


export type MutationRegisterArgs = {
  options: RegisterInput;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationCreateLibraryArgs = {
  input: LibraryInput;
};


export type MutationPublishBookArgs = {
  input: BookInput;
};


export type MutationSubscribeBookArgs = {
  id: Scalars['Int'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type RegisterInput = {
  email: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
  organization: Scalars['Boolean'];
};

export type LibraryResponse = {
  __typename?: 'LibraryResponse';
  errors?: Maybe<Array<FieldError>>;
  library?: Maybe<Library>;
};

export type LibraryInput = {
  title: Scalars['String'];
  description: Scalars['String'];
  icon: Scalars['String'];
};

export type BookResponse = {
  __typename?: 'BookResponse';
  errors?: Maybe<Scalars['String']>;
  book?: Maybe<Book>;
};

export type BookInput = {
  title: Scalars['String'];
  description: Scalars['String'];
  img: Scalars['String'];
  inforLink: Scalars['String'];
  available: Scalars['String'];
};

export type SubscribeResponse = {
  __typename?: 'SubscribeResponse';
  errors?: Maybe<Scalars['String']>;
  shared?: Maybe<Scalars['Boolean']>;
};

export type CreateLibraryMutationVariables = Exact<{
  input: LibraryInput;
}>;


export type CreateLibraryMutation = (
  { __typename?: 'Mutation' }
  & { createLibrary: (
    { __typename?: 'LibraryResponse' }
    & { library?: Maybe<(
      { __typename?: 'Library' }
      & Pick<Library, 'id' | 'title' | 'description' | 'icon'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>> }
  ) }
);

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type PublishBookMutationVariables = Exact<{
  input: BookInput;
}>;


export type PublishBookMutation = (
  { __typename?: 'Mutation' }
  & { publishBook: (
    { __typename?: 'BookResponse' }
    & Pick<BookResponse, 'errors'>
    & { book?: Maybe<(
      { __typename?: 'Book' }
      & Pick<Book, 'title' | 'img' | 'inforLink' | 'available'>
    )> }
  ) }
);

export type RegisterMutationVariables = Exact<{
  options: RegisterInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>> }
  ) }
);

export type SubscribeBookMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type SubscribeBookMutation = (
  { __typename?: 'Mutation' }
  & { subscribeBook: (
    { __typename?: 'SubscribeResponse' }
    & Pick<SubscribeResponse, 'errors' | 'shared'>
  ) }
);

export type BooksQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type BooksQuery = (
  { __typename?: 'Query' }
  & { books: Array<(
    { __typename?: 'Book' }
    & Pick<Book, 'id' | 'description' | 'title' | 'img' | 'inforLink' | 'available' | 'ownerId' | 'subscriberId'>
  )> }
);

export type LibrarysQueryVariables = Exact<{ [key: string]: never; }>;


export type LibrarysQuery = (
  { __typename?: 'Query' }
  & { librarys?: Maybe<Array<(
    { __typename?: 'Library' }
    & Pick<Library, 'id' | 'title' | 'description' | 'icon' | 'adminId'>
  )>> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'hasLibrary'>
  )> }
);


export const CreateLibraryDocument = gql`
    mutation createLibrary($input: LibraryInput!) {
  createLibrary(input: $input) {
    library {
      id
      title
      description
      icon
    }
    errors {
      field
      message
    }
  }
}
    `;
export type CreateLibraryMutationFn = Apollo.MutationFunction<CreateLibraryMutation, CreateLibraryMutationVariables>;

/**
 * __useCreateLibraryMutation__
 *
 * To run a mutation, you first call `useCreateLibraryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLibraryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLibraryMutation, { data, loading, error }] = useCreateLibraryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateLibraryMutation(baseOptions?: Apollo.MutationHookOptions<CreateLibraryMutation, CreateLibraryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLibraryMutation, CreateLibraryMutationVariables>(CreateLibraryDocument, options);
      }
export type CreateLibraryMutationHookResult = ReturnType<typeof useCreateLibraryMutation>;
export type CreateLibraryMutationResult = Apollo.MutationResult<CreateLibraryMutation>;
export type CreateLibraryMutationOptions = Apollo.BaseMutationOptions<CreateLibraryMutation, CreateLibraryMutationVariables>;
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    user {
      id
      username
    }
    errors {
      field
      message
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      usernameOrEmail: // value for 'usernameOrEmail'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const PublishBookDocument = gql`
    mutation publishBook($input: BookInput!) {
  publishBook(input: $input) {
    book {
      title
      img
      inforLink
      available
    }
    errors
  }
}
    `;
export type PublishBookMutationFn = Apollo.MutationFunction<PublishBookMutation, PublishBookMutationVariables>;

/**
 * __usePublishBookMutation__
 *
 * To run a mutation, you first call `usePublishBookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePublishBookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [publishBookMutation, { data, loading, error }] = usePublishBookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePublishBookMutation(baseOptions?: Apollo.MutationHookOptions<PublishBookMutation, PublishBookMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PublishBookMutation, PublishBookMutationVariables>(PublishBookDocument, options);
      }
export type PublishBookMutationHookResult = ReturnType<typeof usePublishBookMutation>;
export type PublishBookMutationResult = Apollo.MutationResult<PublishBookMutation>;
export type PublishBookMutationOptions = Apollo.BaseMutationOptions<PublishBookMutation, PublishBookMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($options: RegisterInput!) {
  register(options: $options) {
    user {
      id
      username
    }
    errors {
      field
      message
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const SubscribeBookDocument = gql`
    mutation SubscribeBook($id: Int!) {
  subscribeBook(id: $id) {
    errors
    shared
  }
}
    `;
export type SubscribeBookMutationFn = Apollo.MutationFunction<SubscribeBookMutation, SubscribeBookMutationVariables>;

/**
 * __useSubscribeBookMutation__
 *
 * To run a mutation, you first call `useSubscribeBookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubscribeBookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [subscribeBookMutation, { data, loading, error }] = useSubscribeBookMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSubscribeBookMutation(baseOptions?: Apollo.MutationHookOptions<SubscribeBookMutation, SubscribeBookMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubscribeBookMutation, SubscribeBookMutationVariables>(SubscribeBookDocument, options);
      }
export type SubscribeBookMutationHookResult = ReturnType<typeof useSubscribeBookMutation>;
export type SubscribeBookMutationResult = Apollo.MutationResult<SubscribeBookMutation>;
export type SubscribeBookMutationOptions = Apollo.BaseMutationOptions<SubscribeBookMutation, SubscribeBookMutationVariables>;
export const BooksDocument = gql`
    query Books($id: Int!) {
  books(id: $id) {
    id
    description
    title
    img
    inforLink
    available
    ownerId
    subscriberId
  }
}
    `;

/**
 * __useBooksQuery__
 *
 * To run a query within a React component, call `useBooksQuery` and pass it any options that fit your needs.
 * When your component renders, `useBooksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBooksQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useBooksQuery(baseOptions: Apollo.QueryHookOptions<BooksQuery, BooksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BooksQuery, BooksQueryVariables>(BooksDocument, options);
      }
export function useBooksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BooksQuery, BooksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BooksQuery, BooksQueryVariables>(BooksDocument, options);
        }
export type BooksQueryHookResult = ReturnType<typeof useBooksQuery>;
export type BooksLazyQueryHookResult = ReturnType<typeof useBooksLazyQuery>;
export type BooksQueryResult = Apollo.QueryResult<BooksQuery, BooksQueryVariables>;
export const LibrarysDocument = gql`
    query Librarys {
  librarys {
    id
    title
    description
    icon
    adminId
  }
}
    `;

/**
 * __useLibrarysQuery__
 *
 * To run a query within a React component, call `useLibrarysQuery` and pass it any options that fit your needs.
 * When your component renders, `useLibrarysQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLibrarysQuery({
 *   variables: {
 *   },
 * });
 */
export function useLibrarysQuery(baseOptions?: Apollo.QueryHookOptions<LibrarysQuery, LibrarysQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LibrarysQuery, LibrarysQueryVariables>(LibrarysDocument, options);
      }
export function useLibrarysLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LibrarysQuery, LibrarysQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LibrarysQuery, LibrarysQueryVariables>(LibrarysDocument, options);
        }
export type LibrarysQueryHookResult = ReturnType<typeof useLibrarysQuery>;
export type LibrarysLazyQueryHookResult = ReturnType<typeof useLibrarysLazyQuery>;
export type LibrarysQueryResult = Apollo.QueryResult<LibrarysQuery, LibrarysQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    username
    hasLibrary
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;