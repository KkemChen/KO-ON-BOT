import RouterMap = Types.RouteMap;
import cheerio from 'cheerio';
import request from "@request";
import { getId } from "@util";


const Router: RouterMap = {
  async ['/desc']({ query }) {
    const { id } = query;
    if (!id) {
      return {
        result: 500,
        errMsg: 'id ?'
      }
    }
    const result = await request(`http://music.migu.cn/v3/music/artist/${id}`, { dataType: 'raw' });
    const $ = cheerio.load(result);
    const name = $('.artist-info .artist-name a').text();
    const picUrl = $('.artist-info .artist-avatar img').attr('src');
    const desc = $('#J_ArtistIntro .content').text();
    return {
      result: 100,
      data: {
        name,
        picUrl,
        id,
        desc,
      },
    };
  },
  async ['/songs']({ query }) {
    const { id, pageno, pageNo } = query;
    let page = pageNo || pageno || 1;
    if (!id) {
      return {
        result: 500,
        errMsg: 'id ?'
      };
    }
    const result = await request(`http://music.migu.cn/v3/music/artist/${id}/song?page=${page}`, { dataType: 'raw' });
    const $ = cheerio.load(result);
    const list = [];
    $('.songlist-body .J_CopySong').each((i, o) => {
      const $song = cheerio(o);
      const artists = [];

      $song.find('.J_SongSingers a').each((i, o) => {
        artists.push({
          id: getId(cheerio(o).attr('href')),
          name: cheerio(o).text()
        })
      });
      const $album = $song.find('.song-belongs a').first();
      const album = {
        id: getId($album.attr('href')),
        name: $album.text(),
      };
      list.push({
        id: $song.attr('data-mid'),
        cid: $song.attr('data-cid'),
        name: $song.find('.song-name-txt').text(),
        artists,
        album,
      })
    });

    const pageList = [1];
    $('.views-pagination .pagination-item').each((i, p) => {
      const $page = cheerio(p).text();
      pageList.push(Number($page || 0));
    });

    return {
      result: 100,
      data: {
        list,
        totalPage: Math.max(...pageList),
      }
    };
  },
  async ['/albums']({ query }) {
    const { id, pageNo = 1, pageno = pageNo } = query;
    if (!id) {
      return {
        result: 500,
        errMsg: 'id ?'
      };
    }
    const result = await request(`http://music.migu.cn/v3/music/artist/${id}/album?page=${pageno}`, { dataType: 'raw' });
    const $ = cheerio.load(result);
    const list = [];
    $('.artist-album-list li').each((i, o) => {
      const $album = cheerio(o);
      const artists = [];
      $album.find('.album-singers a').each((i, o) => {
        artists.push({
          id: getId(cheerio(o).attr('href')),
          name: cheerio(o).text()
        })
      });
      list.push({
        id: getId($album.find('.thumb-link').attr('href')),
        picUrl: $album.find('img.thumb-img').attr('data-original'),
        name: $album.find('.album-name').text(),
        artists,
      })
    });

    const pageList = [1];
    $('.views-pagination .pagination-item').each((i, p) => {
      const $page = cheerio(p).text();
      pageList.push(Number($page || 0));
    });
    return {
      result: 100,
      data: { list, totalPage: Math.max(...pageList) },
    };
  },
}

export default Router;
