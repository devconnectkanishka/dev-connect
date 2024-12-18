"use server";

import Question from "@/database/question.model";
import Tag, { ITag } from "@/database/tag.model";
import User from "@/database/user.model";
import Interaction from "@/database/interaction.model";
import { FilterQuery } from "mongoose";
import { connectToDatabase } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionByTagIdParams,
  GetTagByIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Find the interactions for the user and group by tags
    const interactions = await Interaction.aggregate([
      { $match: { user: user._id.toString() } }, // Match interactions by the specific user
      { $unwind: "$tags" }, // Unwind the tags array to group by each tag
      { $group: { _id: "$tags", count: { $sum: 1 } } }, // Group by tagId and count interactions
      {
        $lookup: {
          from: "tags",
          localField: "_id",
          foreignField: "_id",
          as: "tag",
        },
      }, // Lookup the Tag details
      { $unwind: "$tag" }, // Unwind the tag array
      { $sort: { count: -1 } }, // Sort by the number of interactions (descending)
      { $limit: 5 }, // Limit to top 5 tags
      { $project: { _id: "$tag._id.toString()", name: "$tag.name", count: 1 } }, // Project the fields to return
    ]);

    return interactions; // Return the top interacted tags
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 10 } = params;

    const query: FilterQuery<typeof Tag> = {};

    const skipAmount = (page - 1) * pageSize;

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }

    let sortOptions = {};

    switch (filter) {
      case "popular":
        sortOptions = { questions: 1 };

        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;

      default:
        break;
    }

    const totalTags = await Tag.countDocuments(query);

    const tags = await Tag.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);
    if (!tags) {
      throw new Error("No tags found.");
    }

    const isNext = totalTags > skipAmount + tags.length;

    return { tags, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTagById(params: GetTagByIdParams) {
  try {
    connectToDatabase();

    const { tagId } = params;

    const tag = await Tag.findOne({
      _id: tagId,
    });

    return tag;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionByTagId(params: GetQuestionByTagIdParams) {
  try {
    connectToDatabase();
    const { tagId, searchQuery, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
        skip: skipAmount,
        limit: pageSize,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    const questions = tag.questions;

    const isNext = questions.length > pageSize;

    return { tagTitle: tag.name, questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getPopularTags() {
  try {
    connectToDatabase();

    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);

    return popularTags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
