// Angular
import { Injectable } from '@angular/core';
import { Router, UrlTree, UrlSegment, PRIMARY_OUTLET } from '@angular/router';
// Package
import { isEmpty, map } from 'lodash';

import { ModulesEnum } from '@app/shared/enum/enum';

@Injectable()
export class ModuleUtilsService {
  /**
   * Service constructor
   *
   * @param router: Router
   */
  constructor(private router: Router) {}

  /**
   * Get Module
   *
   */
  getModule(): ModulesEnum {
    return this.getModuleFromRouter();
  }

  /**
   * Convert url path root to ModulesEnum
   *
   * @param urlPath url root string value
   */
  protected _getModule(urlPath: ModulesEnum[keyof ModulesEnum]): ModulesEnum {
    const value = map(ModulesEnum, (val, key) => ({ key, val })).filter(
      (x) => x.val === urlPath
    )[0];
    if (!isEmpty(value)) {
      return ModulesEnum[value.key];
    } else {
      return null;
    }
  }

  /**
   * Get Module from Router by Url
   *
   * @param router Router
   */
  public getModuleFromRouter(router: Router = this.router): ModulesEnum {
    const tree: UrlTree = router.parseUrl(router.url);
    const s: UrlSegment[] = tree.root.children[PRIMARY_OUTLET].segments;
    return this._getModule(s[0].path);
  }
}
