import gql from "graphql-tag";

// export const AddHunt = gql`
//   mutation addHunt($model:HuntModel) {
//     addHunt(model: $model) {
//         __typename
//         insert_hunts(
//             objects: {
//                 currency: "AED", 
//                 link: "google.com", 
//                 title: "iPhone", 
//                 user_id: 1, 
//                 tags: ["iphone", "apple"], 
//                 price: "100"
//             }
//         ){
//         returning {
//             id
//         }
//     }
//     }
//   }
// `;

export const AddHunt = gql`
  mutation addHunt($title: String!, $link: String!, $price: numeric!, $tags: jsonb!, $currency: String!) {
    insert_hunts(objects :{title: $title, link:$link, price:$price, tags:$tags, currency:$currency}) {
      returning{
        title
      }
    }
  }
`;

export const EditBio = gql`
  mutation editBio($id:String!, $bio:String!) {
    update_users(where: {id: {_eq: $id}}, _set: {bio: $bio}) {
      returning{
        id,
        bio
      }
    }
  }
`;

export const RemoveHunt = gql`
  mutation removeHunt($id: Int!) {
    delete_hunts(where: {id: {_eq: $id}}) {
      affected_rows
    }
  }
`;

export const Upvote = gql`
  mutation upsert_votes ($hunt_id:Int!){
  insert_votes(
    objects: {hunt_id:$hunt_id,upvote:true,downvote:false}, 
    on_conflict: {constraint:allow_single_votes, update_columns:[upvote,downvote]}
  ) {
    returning{
      id
    }
  }
}
`;

export const Downvote = gql`
  mutation upsert_votes ($hunt_id:Int!){
  insert_votes(
    objects: {hunt_id:$hunt_id,upvote:false,downvote:true}, 
    on_conflict: {constraint:allow_single_votes, update_columns:[upvote,downvote]}
  ) {
    returning{
      id
    }
  }
}
`;

export const Unvote = gql`
  mutation upsert_votes ($hunt_id:Int!){
  insert_votes(
    objects: {hunt_id:$hunt_id,upvote:false,downvote:false}, 
    on_conflict: {constraint:allow_single_votes, update_columns:[upvote,downvote]}
  ) {
    returning{
      id
    }
  }
}
`;

export const TrackClicks = gql`
  mutation track_clicks ($hunt_id:Int!){
    update_hunts(where: {id: {_eq: $hunt_id}},_inc: {views: 1}) {
      affected_rows
    }
  }
`;