// components/ProductList.js
export default function ProductList({ products }) {
  return (
    <div>
      {products.map((product) => (
        <div key={product._id}>
          <h3>{product.fullname}</h3>        
         <p>{product.email}</p>         
        </div>
      ))}
    </div>
  );
}
