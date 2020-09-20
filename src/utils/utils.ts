import { parse } from 'querystring';
import {TreeNodeNormal} from "antd/es/tree/Tree";

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);


export const listToTreeTable = <T extends {parentId: string | number}> (list: Array<T>) => {
  let parentList = list.filter(item => item.parentId === '0' || item.parentId === 0);
  parentList.forEach( parent => {
    addChildren(parent, list);
  });
  return parentList;
};

const addChildren = (parent: any, list: any[]) => {
  const children = list.filter(item => parent.id === item.parentId);
  if (children && children.length > 0) {
    children.forEach(child => {
      addChildren(child, list);
    });
    parent.children = children;
  }
};

export const listToTreeData = <T extends {parentId: number | string, name: string, id: number | string}>(list: T[]): TreeNodeNormal[] => {
  const treeList = list.map(item => {
    return {
      title: item.name,
      key: item.id,
      id: item.id,
      parentId: item.parentId,
      valueRef: item,
    }
  });
  return listToTreeTable(treeList);
};


/**
 * 下载文件的callback
 * @param blob 二进制流
 * @param fileName 文件名
 */
export const downloadCallback = (blob: Blob, fileName: string) => {
  if (blob instanceof Blob) {
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, fileName)
    } else {
      const link = document.createElement('a');
      const evt = document.createEvent('MouseEvents');
      link.style.display = 'none';
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link); // 此写法兼容可火狐浏览器
      evt.initEvent('click', false, false);
      link.dispatchEvent(evt);
      document.body.removeChild(link);
    }
  }
};
