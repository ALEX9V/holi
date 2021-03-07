/**
 * @typedef User
 * @property {string} id
 * @property {string} username
  */
/**
 * @typedef UserProfile
 * @property {string} id
 * @property {string} username
 * @property {string} Email
 * @property {number} FollowersCount
 * @property {number} FolloweesCount
 *  @property {number} Followeed
  */
 /**
  * @typedef LoginOutput
  * @property {string} Token
  * @property {string|Date} ExpiresAt
  * @property {User} AuthUser
  */

 /**
  * @typedef Post
  * @property {string} ID
  * * @property {string} UserID
  * @property {string} Content
  * @property {string|Date} CreatedAt
   * @property {int64} LikesCount
  *  @property {User=} user
  * 
  */
 /**
  * @typedef Comment
  * @property {string} ID
  * * @property {string} UserID
  * @property {string} Content
  * @property {string|Date} CreatedAt
   * @property {int64} LikesCount
  *  @property {User=} user
  * 
  */
 
 
 /**
  * @typedef TimelineItem
  * @property {string} id
  * @property {Post=} post
  */
 /**
  * @typedef CreatePostInput
  * @property {string} Content
  * @property {boolean=} NSFW
  * @property {string=} SpoilerOf
  */
 
  export default undefined