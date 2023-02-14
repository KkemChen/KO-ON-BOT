import RouteMap = Types.RouteMap;
import SongInfo = Types.SongInfo;
import ArtistInfo = Types.ArtistInfo;
import AlbumInfo = Types.AlbumInfo;
import MvInfo = Types.MvInfo;
import PlaylistInfo = Types.PlaylistInfo;
import request from "@request";

const Router: RouteMap = {
  async ['/']({ query }) {
    query.type = query.type || 'song';
    if (!query.keyword) {
      return {
        result: 500,
        errMsg: '搜啥呢？',
      }
    }

    const { keyword, pageno = 1, pageNo = pageno, pageSize = 20 } = query;
    const typeMap = {
      song: 2,
      singer: 1,
      album: 4,
      playlist: 6,
      mv: 5,
      lyric: 7,
    };

    const result = await request({
      url: 'https://m.music.migu.cn/migu/remoting/scr_search_tag',
      data: {
        keyword,
        pgc: pageNo,
        rows: pageSize,
        type: typeMap[query.type],
      },
    });

    if (!result) {
      return {
        result: 100,
        data: {
          list: [],
          total: 0,
        },
      }
    }

    let data: SongInfo[] | ArtistInfo[] | AlbumInfo[] | MvInfo[] | PlaylistInfo[];
    switch (query.type) {
      case 'lyric':
      case 'song':
        data = (result.musics || []).map(({ songName, singerId, singerName, albumName, albumId, mp3, cover, id, copyrightId, mvId, mcCopyrightId }) => {
          const singerIds = singerId.replace(/\s/g, '').split(',');
          const singerNames = singerName.replace(/\s/g, '').split(',');
          const artists: ArtistInfo[] = singerIds.map((id, i) => ({ id, name: singerNames[i] }));
          return {
            name: songName,
            id,
            cid: copyrightId,
            mvId,
            mvCid: mcCopyrightId,
            url: mp3,
            album: {
              picUrl: cover,
              name: albumName,
              id: albumId,
            },
            artists,
          }
        });
        break;
      case 'singer':
        data = result.artists.map(({ title, id, songNum, albumNum, artistPicM }) => ({
          name: title,
          id,
          picUrl: artistPicM,
          songCount: songNum,
          albumCount: albumNum,
        }));
        break;
      case 'album':
        data = result.albums.map(({ albumPicM, singer, songNum, id, publishDate, title }) => ({
          name: title,
          id,
          artists: singer,
          songCount: songNum,
          publishTime: publishDate,
          picUrl: albumPicM,
        }));
        break;
      case 'playlist':
        data = result.songLists.map(({ name, img, id, playNum, musicNum, userName, userId, intro }) => ({
          name,
          id,
          picUrl: img,
          playCount: playNum,
          songCount: musicNum,
          intro,
          creator: {
            name: userName,
            id: userId,
          }
        }));
        break;
      case 'mv':
        data = result.mv.map(({ songName, id, mvCopyrightId, mvId, copyrightId, albumName, albumId, singerName, singerId }) => {
          const singerIds = singerId.replace(/\s/g, '').split(',');
          const singerNames = singerName.replace(/\s/g, '').split(',');
          const artists: ArtistInfo[] = singerIds.map((id, i) => ({ id, name: singerNames[i] }));
          return {
            name: songName,
            id,
            mvId,
            cid: copyrightId,
            mvCid: mvCopyrightId,
            album: {
              name: albumName,
              id: albumId,
            },
            artists,
          }
        });
        break;
    }

    return {
      result: 100,
      data: {
        list: data,
        total: result.pgt,
      },
    }
  },
}

export default Router;
