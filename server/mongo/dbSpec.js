module.exports = {
  collections: [
    "notes",
    "comments"
  ],
  models: {
    "comment": {
      name: "Comment",
      schema: {
        parentId: String,
        authorId: String,
        bodyMd: String,
        miscData: Object,
        bodyText: String,
        createdOn: Date,
        votesId: String,
        lastEdited: Date,
        children: Array
      }
    },
    "thread": {
      name: "Thread",
      schema: {
        title: String,
        authorId: String,
        bodyMd: String,
        miscData: Object,
        bodyText: String,
        createdOn: Date,
        link: String,
        lastEdited: Date,
        children: Array
      }
    },
    "votes": {
      name: "Votes",
      schema: {
        targetId: String,
        upVoterIds: Array,
        downVoterIds: Array,
        upvotes: Number,
        downvotes: Number
      }
    },
    "user": {
      name: "User",
      schema: {
        clearPass: String,
        publicHash: String,
        hashNums: Number,
        origIP: String,
        allIPs: String,
        createdOn: Date
      }
    },
    "node": {
      name: "Node",
      schema: {
        _id: String,  //node_name,node_type (ie hello_world,thread)
        no_Comments: Number,
        no_Votes: Number
      }
    },
    "edges": {
      name: "Edges",
      schema: {
        _id: String, //node_name,node_type,edge_type (ie hello_world,thread,voters)
        targets: Array
      /* Target spec: [
         {
            id: String, //node _id
            weight: Number //0-1 priority weighting
          }
        ]*/
      }
    }
  }
};
