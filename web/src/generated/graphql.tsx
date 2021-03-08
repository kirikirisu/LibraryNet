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
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Library = {
  __typename?: 'Library';
  id: Scalars['Float'];
  description: Scalars['String'];
  icon: Scalars['String'];
  organization: Scalars['Boolean'];
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
  available: Scalars['Boolean'];
  ownerId: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  createLibrary: Library;
  publishBook: Book;
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
};

export type LibraryInput = {
  description: Scalars['String'];
  icon: Scalars['String'];
  organization: Scalars['Boolean'];
};

export type BookInput = {
  title: Scalars['String'];
  description: Scalars['String'];
  img: Scalars['String'];
  inforLink: Scalars['String'];
  available: Scalars['Boolean'];
};

export type LibrarysQueryVariables = Exact<{ [key: string]: never; }>;


export type LibrarysQuery = (
  { __typename?: 'Query' }
  & { librarys?: Maybe<Array<(
    { __typename?: 'Library' }
    & Pick<Library, 'id' | 'description' | 'icon' | 'organization' | 'adminId'>
  )>> }
);


export const LibrarysDocument = gql`
    query Librarys {
  librarys {
    id
    description
    icon
    organization
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