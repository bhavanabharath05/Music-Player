import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const getSongs = async (req, res) => {
  try {
    const clientId = process.env.JAMENDO_CLIENT_ID;

    const response = await axios.get(
      `https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=jsonpretty&limit=15`
    );

    res.status(200).json(response.data.results || []);
  } catch (error) {
    console.error("Get songs error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getPlaylistTag = async (req, res) => {
  try {
    const tag = req.params.tag || req.query.tag || req.body?.tag;

    console.log("✅ Tag endpoint hit:", tag);

    if (!tag) {
      return res.status(400).json({ message: "Missing Tag Parameters" });
    }

    const limit = parseInt(req.query.limit ?? "50", 10) || 50;
    const clientId = process.env.JAMENDO_CLIENT_ID;

    const params = {
      client_id: clientId,
      format: "jsonpretty",
      tags: tag.toLowerCase(),
      limit: limit,
    };

    console.log("Fetching from Jamendo with params:", params);

    const response = await axios.get(
      "https://api.jamendo.com/v3.0/tracks",
      { params }
    );

    const songs = response.data.results || [];

    console.log(`Found ${songs.length} songs for tag: ${tag}`);

    // ✅ FIX: Return the results array directly, not the whole data object
    if (songs.length === 0) {
      return res.status(404).json({ 
        message: `No songs found for tag: ${tag}`,
        results: [] 
      });
    }

    res.status(200).json(songs);

  } catch (error) {
    console.error("Get playlist tag error:", error.message);
    res.status(500).json({ 
      message: error.message,
      results: [] 
    });
  }
};

const toggleFavourite = async (req, res) => {
  try {
    const user = req.user;
    const song = req.body.song;

    console.log("Toggle favourite for user:", user._id);
    console.log("Song data:", song);

    if (!song || !song.id) {
      return res.status(400).json({ 
        message: "Song data is required with an id field" 
      });
    }

    // ✅ FIX: Check if favourites array exists
    if (!user.favourites) {
      user.favourites = [];
    }

    const exists = user.favourites.find(
      (fav) => fav.id === song.id
    );

    if (exists) {
      // Remove from favourites
      user.favourites = user.favourites.filter(
        (fav) => fav.id !== song.id
      );
      console.log("Song removed from favourites");
    } else {
      // Add to favourites
      user.favourites.push({
        id: song.id,
        name: song.name || "Unknown",
        artist_name: song.artist_name || "Unknown Artist",
        image: song.image || "",
        duration: song.duration || 0,
        audio: song.audio || ""
      });
      console.log("Song added to favourites");
    }

    await user.save();

    console.log("Favourites updated, count:", user.favourites.length);

    return res.status(200).json(user.favourites);

  } catch (error) {
    console.error("Toggle favourite error:", error);
    console.error("Error message:", error.message);
    return res.status(500).json({ 
      message: "Failed to update favourites",
      error: error.message 
    });
  }
};

export { getSongs, getPlaylistTag, toggleFavourite };