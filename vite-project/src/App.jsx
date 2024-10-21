import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * 10;
      const limit = 10;
      const res = await fetch(
        `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
      );
      const data = await res.json();
      setProducts(data.products);
    } catch (error) {
      console.log(`couldn't fetch data: ${error}`);
    } finally {
      setLoading(false);
    }

    if (total === 0) {
      const totalRes = await fetch(`https://dummyjson.com/products`);
      const totalData = await totalRes.json();
      setTotal(totalData.products.length);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const increasePageCount = () => {
    if (page < Math.ceil(total / 10)) {
      setPage(page + 1);
    }
  };

  const decreasePageCount = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const selectPageHandler = (pageIndex) => {
    setPage(pageIndex);
  };

  return (
    <>
      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <>
          <div className="products">
            {products.map((prod) => {
              return (
                <span className="products__single" key={prod.id}>
                  <img src={prod.thumbnail} alt={prod.title} />
                  <span>{prod.title}</span>
                </span>
              );
            })}
          </div>
          {total > 0 && (
            <div className="pagination">
              <span
                onClick={() => decreasePageCount()}
                className={page === 1 ? "hide-btn" : ""}
              >
                prev
              </span>
              {[...Array(Math.ceil(total / 10))].map((_, i) => {
                return (
                  <span
                    onClick={() => selectPageHandler(i + 1)}
                    key={i}
                    className={page === i + 1 ? "pagination__selected" : ""}
                  >
                    {i + 1}
                  </span>
                );
              })}
              <span
                onClick={() => increasePageCount()}
                className={page === total / 10 ? "hide-btn" : ""}
              >
                next
              </span>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default App;
