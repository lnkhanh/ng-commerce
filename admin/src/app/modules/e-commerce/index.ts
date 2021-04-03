
// Models
export { CustomerModel } from './_models/customer.model';
export { ProductType } from './_models/product.model';
export { CategoryType } from './_models/category.model';
export { OrderType } from './_models/order.model';

// DataSources
export { CustomerDataSource } from './_data-sources/customer.datasource';
export { ProductDataSource } from './_data-sources/product.datasource';
export { CategoryDataSource } from './_data-sources/category.datasource';
export { OrderDataSource } from './_data-sources/order.datasource';

// Actions
// Customer Actions =>
export {
  FetchListAction,
  SaveListAction,
  SaveRequestParamsAction,
  CreateCustomerAction,
  CreateCustomerSuccessAction,
  FetchCustomerDetailsAction,
  UpdateCustomerAction,
  SaveCurrentCustomerAction,
  ArchiveCustomerAction,
  ArchiveCustomerSuccessAction,
  CustomerChangePasswordAction,
} from './_actions/customer.actions';
// Product actions =>
export { ProductActionTypes, ProductActions } from './_actions/product.actions';
// ProductSpecification Actions =>

// Effects
export { CustomerEffects } from './_effects/customer.effects';
export { ProductEffects } from './_effects/product.effects';
export { StoreEffects } from './_effects/store.effects';
export { CategoryEffects } from './_effects/category.effects';
export { OrderEffects } from './_effects/order.effects';
export { DashboardEffects } from './_effects/dashboard.effects';
export { OptionSetEffects } from './_effects/option-set.effects';

// Reducers
export { customersReducer } from './_reducers/customer.reducers';
export { productReducer } from './_reducers/product.reducers';
export { storeReducer } from './_reducers/store.reducers';
export { categoryReducer } from './_reducers/category.reducers';
export { orderReducer } from './_reducers/order.reducers';
export { dashboardReducer } from './_reducers/dashboard.reducers';
export { optionSetReducer } from './_reducers/option-set.reducers';

// Selectors
export {
  selectCustomerPagination,
  selectCustomerList,
  selectCurrentCustomer,
} from './_selectors/customer.selectors';
export {
  selectProductPagination,
  selectProductList,
  selectCurrentProduct,
} from './_selectors/product.selectors';
// Store selectors
export {
  selectStorePagination,
  selectStoreList,
  selectCurrentStore,
} from './_selectors/store.selectors';
// Option Set selectors
export {
  selectOptionSetPagination,
  selectOptionSetList,
  selectCurrentOptionSet,
} from './_selectors/option-set.selectors';
// Category selectors
export {
  selectCategoryPagination,
  selectCategoryList,
  selectCurrentCategory,
} from './_selectors/category.selectors';
// Order selectors
export {
  selectOrderPagination,
  selectOrderList,
  selectCurrentOrder,
} from './_selectors/order.selectors';

// Services
export { CustomerService } from './_services/';
export { ProductService } from './_services/';
export { StoreService } from './_services/';
export { CategoryService } from './_services/';
export { OrderService } from './_services/';
export { DashBoardService } from './_services/';
export { OptionSetService } from './_services/';
