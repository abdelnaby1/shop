import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from "../actions";

const filter_reducer = (state, action) => {
  switch (action.type) {
    case LOAD_PRODUCTS:
      let maxPrice = action.payload.map((p) => p.price);
      maxPrice = Math.max(...maxPrice);
      return {
        ...state,
        all_products: [...action.payload],
        filtered_products: [...action.payload],
        filters: { ...state.filters, max_price: maxPrice, price: maxPrice },
      };
    case SET_GRIDVIEW:
      return {
        ...state,
        grid_view: true,
      };
    case SET_LISTVIEW:
      return {
        ...state,
        grid_view: false,
      };
    case UPDATE_SORT:
      return {
        ...state,
        sort: action.payload,
      };
    case SORT_PRODUCTS:
      const { sort, filtered_products } = state;
      let tempProducts = [...filtered_products];
      if (sort === "price-lowest") {
        tempProducts = tempProducts.sort((a, b) => a.price - b.price);
      }
      if (sort === "price-highest") {
        tempProducts = tempProducts.sort((a, b) => b.price - a.price);
      }
      if (sort === "name-a") {
        tempProducts = tempProducts.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
      }
      if (sort === "name-z") {
        tempProducts = tempProducts.sort((a, b) => {
          return b.name.localeCompare(a.name);
        });
      }
      return { ...state, filtered_products: tempProducts };
    case UPDATE_FILTERS:
      const { name, value } = action.payload;
      return { ...state, filters: { ...state.filters, [name]: value } };
    case FILTER_PRODUCTS:
      const { all_products } = state;
      let tempProducts2 = [...all_products];

      const { text, category, company, color, price, shipping } = state.filters;
      if (text) {
        tempProducts2 = tempProducts2.filter((p) => {
          return p.name.toLowerCase().startsWith(text);
        });
      }
      if (category !== "all") {
        tempProducts2 = tempProducts2.filter((p) => {
          return p.category === category;
        });
      }
      if (company !== "all") {
        tempProducts2 = tempProducts2.filter((p) => {
          return p.company === company;
        });
      }
      if (color !== "all") {
        tempProducts2 = tempProducts2.filter((p) => {
          return p.colors.find((c) => c === color);
        });
      }
      tempProducts2 = tempProducts2.filter((p) => {
        return p.price <= price;
      });

      if (shipping) {
        tempProducts2 = tempProducts2.filter((p) => {
          return p.shipping === true;
        });
      }
      return { ...state, filtered_products: tempProducts2 };
    case CLEAR_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          text: "",
          company: "all",
          category: "all",
          colors: "all",
          price: state.filters.max_price,
          shipping: false,
        },
      };
    default:
      throw new Error(`No Matching "${action.type}" - action type`);
  }
};

export default filter_reducer;
