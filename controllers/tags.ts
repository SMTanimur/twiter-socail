import { NextApiResponse } from "next";
import { ExtendedNextApiRequest } from "lib/types.api";
import Tag from "models/Tag";

// @ route GET /api/tags/
// @ desc returns top 5 tags sorted by number of posts
// @ access public

export const getTopTags = async (
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) => {
  try {
    const tags = await Tag.aggregate([
      {
        $project: {
          length: { $size: "$posts" },
          // posts: 1,
          name: 1,
        },
      },
      { $sort: { length: -1 } },
      { $limit: 10 },
    ]);
    // const tags = await Tag.find({}).sort({ totalPosts: -1 }).limit(5);

    return res.status(200).json(tags);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
// @ route GET /api/tags/:tag
// @ desc get all posts under a tag
// @ access public

export const getPostsByTag = async (
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) => {
  const { tag }: { tag?: string } = req.query;
  try {
    const data = await Tag.find({ name: tag }).populate({
      path: "posts",
      populate: [{ path: "tags", select: "name" }, { path: "user" }],
    });
    console.log(data);

    if (data.length == 0)
      return res.status(404).json({ msg: "Tag does not exist" });
    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};
