import { HydratedDocument } from "mongoose";
import { ActionResult } from "../../types/ActionResult.js";
import { isValidUrlFormat } from "../../utils/urlFormatValidator.js";
import { IUrl, Url } from "../models/Url.js";

export const createUrl = async ( urlToShorten:string ): Promise<ActionResult<HydratedDocument<IUrl> | null>> => {
  const result = new ActionResult<HydratedDocument<IUrl> | null>(null);

  if (!isValidUrlFormat(urlToShorten)) {
    result.setError(400, "Invalid URL format");
    return result;
  }

  try {
    const urlId = await Url.generateId();
    result.data = await Url.create({
      _id: urlId,
      originalUrl: urlToShorten,
      shortUrl: `https://${process.env.API_DOMAIN}/${urlId}`,
    });
  } catch (error) {
    result.setError(500, "An error ocurred while creating the shortened URL");
  }


  return result;
};