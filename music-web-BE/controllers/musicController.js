import { ZingMp3 } from "zingmp3-api-full-v3";
import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import FileCookieStore  from "tough-cookie-file-store";

const cookieJar = new CookieJar(new FileCookieStore("./cookie.json"));

const client = wrapper(
  axios.create({
    jar: cookieJar, // cookieJar bắt buộc
    withCredentials: true,
  })
);

const getSong = (req, res) => {
  ZingMp3.getSong(req.query.id).then((data) => {
    res.json(data);
  });
};

const getDetailPlaylist = (req, res) => {
  ZingMp3.getDetailPlaylist(req.query.id).then((data) => {
    res.json(data);
  });
};

const getHome = (req, res) => {
  ZingMp3.getHome().then((data) => {
    res.json(data);
  });
};

const getTop100 = (req, res) => {
  ZingMp3.getTop100().then((data) => {
    res.json(data);
  });
};

const getChartHome = (req, res) => {
  ZingMp3.getChartHome().then((data) => {
    res.json(data);
  });
};

const getNewReleaseChart = (req, res) => {
  ZingMp3.getNewReleaseChart().then((data) => {
    res.json(data);
  });
};

const getInfo = (req, res) => {
  ZingMp3.getInfoSong(req.query.id).then((data) => {
    res.json(data);
  });
};

const getArtist = (req, res) => {
  ZingMp3.getArtist(req.query.name).then((data) => {
    res.json(data);
  });
};

const getArtistSong = (req, res) => {
  ZingMp3.getListArtistSong(req.query.id, req.query.page, req.query.count).then((data) => {
    res.json(data);
  });
};

const getLyric = (req, res) => {
  ZingMp3.getLyric(req.query.id).then((data) => {
    res.json(data);
  });
};

const search = (req, res) => {
  ZingMp3.search(req.query.keyword).then((data) => {
    res.json(data);
  });
};

const getListMV = (req, res) => {
  ZingMp3.getListMV(req.query.id, req.query.page, req.query.count).then((data) => {
    res.json(data);
  });
};

const getCategoryMV = (req, res) => {
  ZingMp3.getCategoryMV(req.query.id).then((data) => {
    res.json(data);
  });
};

const getVideo = (req, res) => {
  ZingMp3.getVideo(req.query.id).then((data) => {
    res.json(data);
  });
};

const getGenre = async (req, res) => {
  try {
    const response = await client.get(process.env.API_GENRE, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
        Referer: "https://zingmp3.vn/hub",
        Origin: "https://zingmp3.vn",
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
        Cookie: cookieJar,
      },
    });
    res.json(response?.data?.data?.genre);
  } catch (err) {
    console.error("API Error:", err.message);
    res.status(500).json({ error: "Failed to fetch genre" });
  }
};

const getAllArtist = async (req, res) => {
  try {
    const allArtists = [];
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

    for (const letter of alphabet) {
      const response = await ZingMp3.search(letter);
      allArtists.push(...response.data.artists);
    }

    res.json(allArtists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching artists" });
  }
};

export {
  getSong,
  getDetailPlaylist,
  getHome,
  getTop100,
  getChartHome,
  getNewReleaseChart,
  getInfo,
  getArtist,
  getArtistSong,
  getLyric,
  search,
  getListMV,
  getCategoryMV,
  getVideo,
  getGenre,
  getAllArtist,
};
