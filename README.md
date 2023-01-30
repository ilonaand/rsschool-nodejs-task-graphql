## Assignment: Graphql
### Tasks:
1. Add logic to the restful endpoints (users, posts, profiles, member-types folders in ./src/routes).  
   1.1. npm run test - 100%  - DONE
2. Add logic to the graphql endpoint (graphql folder in ./src/routes).  
Constraints and logic for gql queries should be done based on restful implementation.  
For each subtask provide an example of POST body in the PR.  
All dynamic values should be sent via "variables" field.  
If the properties of the entity are not specified, then return the id of it.  
`userSubscribedTo` - these are users that the current user is following.  
`subscribedToUser` - these are users who are following the current user.  

    DONE 2.1, 2.2, 2.8-2.11, 2.12-2.15, 2.17 
    ( Base is empty; before use you need create entities 
    by mutations in 2.8-2.10 and later change ID in queries )

   
   * Get gql requests:  
   2.1. Get users, profiles, posts, memberTypes - 4 operations in one query.  
   QUERY:

   ```yaml 
   query All {
         users {
            id
         }
         posts {
            id 
         }
         profiles {
            id
         }
         memberTypes {
            id,
            discount,
            monthPostsLimit 
         }
      }
   ```
   2.2. Get user, profile, post, memberType by id - 4 operations in one query.  
   QUERY:

    ```yaml 
    query allById($idUser: ID, $idProfile: ID, $idPost: ID, $idMember: ID ) {
      user(id: $idUser) {
         id,
         firstName,
         lastName,
         email
         },
      profile(id: $idProfile) {
         id,
         userId,
         avatar,
         },
      post(id: $idPost) {
         id
         },
      memberType(id: $idMember) {
         id
         }
      }
    ```
   Variables:

    ```yaml 
      {
         "idUser": "30ad2f97-49ff-448e-a469-9ac4eaa73b84",
         "idProfile": "c792e4fc-e64b-4eaa-9bf7-23f479499412",
         "idPost": "46e512f2-0047-4ae0-8c7f-1e6bb7d0467f",
         "idMember": "basic"
     }
    ```
   2.3. Get users with their posts, profiles, memberTypes.  
   2.4. Get user by id with his posts, profile, memberType.  
   2.5. Get users with their `userSubscribedTo`, profile.  
   2.6. Get user by id with his `subscribedToUser`, posts.  
   2.7. Get users with their `userSubscribedTo`, `subscribedToUser` (additionally for each user in `userSubscribedTo`, `subscribedToUser` add their `userSubscribedTo`, `subscribedToUser`).  
   * Create gql requests:   
   2.8. Create user. 
   QUERY:

    ```yaml 
      mutation AddNewUser ($user: UserInput!) {
         createUser(user: $user) {
            id,  
            firstName,
            lastName,
            email
         }
      }
    ```
    Variables:

    ```yaml 
         {
         "user": {
            "firstName":"jan",
            "lastName":"Gettings",
            "email": "false@gmail.com"
         }
      }
    ```

   2.9. Create profile.
   QUERY:

    ```yaml 
    mutation AddNewProfile ($profile: ProfileInput!) {
      createProfile(profile: $profile) {
         id,  
         avatar
        }
      }

    ```
    Variables:

    ```yaml
      {
         "profile": {
            "avatar":"jan.png",
            "sex": "male",
            "birthday": 24,
            "country": "РБ",
            "street": "Голубева",
            "city": "Минск",
            "userId": "06226f75-1484-4a3d-aa65-e59a00d42c82",
            "memberTypeId": "basic"
         }
      } 
    ```  
   2.10. Create post.  
   QUERY:

    ```yaml 
      mutation AddNewPost ($post: PostInput!) {
         createPost(post: $post) {
            id,
            content
            }
         }
    ```
    Variables:

    ```yaml 
      {
         "post": {
            "title": "Название",
            "content": "Content",
            "userId": "06226f75-1484-4a3d-aa65-e59a00d42c82"
         }
      }
    ```
   2.11. [InputObjectType](https://graphql.org/graphql-js/type/#graphqlinputobjecttype) for DTOs.  
   * Update gql requests:  
   2.12. Update user.  
   QUERY:

    ```yaml 
      mutation UpdateUser ($user: UserUpdate!) {
         updateUser(user: $user) {
            id,  
            firstName,
            lastName,
            email
            }
         }
    ```
    Variables:

    ```yaml 
      {
         "user": {
            "id": "30ad2f97-49ff-448e-a469-9ac4eaa73b84",
            "email": "miller@gmail.com"
         }
      }
    ```
   2.13. Update profile.  
   QUERY:

    ```yaml 
      mutation UpdateProfile ($profile: ProfileUpdate!) {
         updateProfile(profile: $profile) {
            id,  
            avatar,
            memberTypeId
         }
      }
    ```
    Variables:

    ```yaml 
      {
      "profile": {
         "id": "312a0db4-4b4b-494b-8d22-156507f44202",
         "avatar": "ava.jpg",
         "memberTypeId": "basic"
        }
      }
    ```
   2.14. Update post.  
   QUERY:

    ```yaml 
      mutation UpdatePost ($post: PostUpdate!) {
         updatePost(post: $post) {
            id,  
            title,
            content
         }
      }
    ```
    Variables:

    ```yaml 
      {
         "post": {
            "id": "19035e8f-bed4-4f00-825d-751e20e7104d",
            "title": "Тема",
            "content": "Интересный"
            
         }
      }
    ```
   2.15. Update memberType.  
   QUERY:

    ```yaml 
      mutation UpdateMmemberType ($memberType: MemberTypeUpdate!) {
         updateMemberTypes(memberType: $memberType) {
            id,  
            discount,
            monthPostsLimit
         }
      }
    ```
    Variables:

    ```yaml 
            {
      "memberType": {
         "id": "basic",
         "discount": 2,
         "monthPostsLimit": 10
        }
      }
    ```
   2.16. Subscribe to; unsubscribe from.  
   2.17. [InputObjectType](https://graphql.org/graphql-js/type/#graphqlinputobjecttype) for DTOs.  


