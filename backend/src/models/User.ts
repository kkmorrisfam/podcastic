import mongoose from "mongoose";

const EpisodeSchema = new mongoose.Schema(
  {
    id: String,
    title: String,
    audioUrl: String,
    podcastId: Number,
    image: String,
    author: String,
    durationSec: Number,
    publishedAt: Number,
    episode: Number,
    feedImage: String,
  },
  { _id: false }
);


const PodcastSchema =  new mongoose.Schema(
  {
  id: {type: String, required: true},
  title: {type: String},
  image: {type: String},
  author: {type: String},
  url: {type: String},
  },
  {_id: false}  //use podcast id, not mongo version
);

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },

    library: {
      type: Map,
      of: EpisodeSchema,
      default: {},
    },

    favorites: {
      type: [String],  //episode ids
      default: [],
    },

    podcastLibrary: {
      type: Map,
      of: PodcastSchema,
      default: {},
    },

    queue: {
      type: [
        {
          episodeId: String,
        },
      ],
      default: [],
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
