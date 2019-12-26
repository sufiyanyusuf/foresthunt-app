import gql from "graphql-tag";

export const userHuntsQuery = gql`
  query hunts ($user_id:String) {
    hunts(where: {user_id: {_eq: $user_id}}) {
        id
        currency
        user_id
        price
        title
        tags
        link
    }
  }
`;

export const UserProfileQuery = gql`
  query user ($user_id:String) {
    users(where: {id: {_eq: $user_id}}) {
      id
      first_name
      last_name
      handle
      bio
    }
  }
`;

export const huntsFeedQuery = gql`
query hunts {
  hunts {
    id
    timestamp
    currency
    user_id
    price
    title
    tags
    link
    views
    user {
      handle
      id
    }
    upvotes:votes_aggregate(where: {upvote: {_eq: true}}) {
      nodes {
        user_id
      }
      aggregate {
        count
      }
    }
    downvotes:votes_aggregate(where: {downvote: {_eq: true}}) {
      nodes {
        user_id
      }
      aggregate {
        count
      }
    }
  }
}
`;
