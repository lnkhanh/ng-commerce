export class MenuConfig {
  public defaults: any = {
    header: {
      self: {},
      items: [],
    },
    aside: {
      self: {},
      items: [
        {
          title: 'Dashboard',
          root: true,
          icon: 'flaticon2-architecture-and-city',
          page: '/ecommerce/dashboard',
          translate: 'MENU.DASHBOARD',
          bullet: 'dot',
        },
        { section: 'Application' },
        {
          title: 'POS',
          root: false,
          icon: 'flaticon-squares',
          page: '/pos/home',
          bullet: 'dot',
        },
        {
          title: 'eCommerce',
          root: true,
          bullet: 'dot',
          icon: 'flaticon2-list-2',
          // permission: "accessToECommerceModule",
          submenu: [
            {
              title: 'Orders',
              page: '/ecommerce/orders',
            },
            {
              title: 'Products',
              page: '/ecommerce/products',
            },
            {
              title: 'Option Sets',
              page: '/ecommerce/option-sets',
            },
            {
              title: 'Customers',
              page: '/ecommerce/customers',
            },
            {
              title: 'Categories',
              page: '/ecommerce/categories',
            },
            {
              title: 'Stores',
              page: '/ecommerce/stores',
            },
          ],
        },
        {
          title: 'System',
          root: true,
          bullet: 'dot',
          icon: 'flaticon2-settings',
          submenu: [
            {
              title: 'Users',
              page: '/user-management/users',
            },
            {
              title: 'Backup',
              page: '/settings/backup',
            }
          ],
        },
      ],
    },
  };

  public get configs(): any {
    return this.defaults;
  }
}
