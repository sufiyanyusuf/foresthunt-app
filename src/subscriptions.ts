import gql from "graphql-tag";

export const userHuntsSubscription = gql`
subscription hunts ($user_id:String) {
    hunts(where: {user_id: {_eq: $user_id}},order_by: {timestamp: desc}) {
        id
        currency
        user_id
        price
        title
        tags
        link
        views
        timestamp
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

export const huntsFeedSubsciption = gql`
subscription hunts ($cursor:Int!, $limit:Int!){
  hunts (order_by: {id: desc}, limit: $limit, where: {id: {_lt: $cursor}}) {
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


export const votesSubscription = gql`
subscription hunts ($id:Int!) {
  hunts(where: {id: {_eq: $id}}) {
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

// subscription MyQuery {
//     votes_aggregate(where: {upvote: {_eq: true},hunt_id: {_eq: 40}}) {
//       aggregate {
//         count(columns: upvote)
//       }
//     }
//   }