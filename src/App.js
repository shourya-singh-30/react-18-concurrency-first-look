import { useState, useTransition } from 'react';

import { generateProducts } from './data';
import ProductList from './components/ProductList';
import CommentSection from './components/CommentSections';

const dummyProducts = generateProducts();

function filterProducts(filterTerm) {
  if (!filterTerm) {
    return dummyProducts;
  }
  return dummyProducts.filter((product) => product.includes(filterTerm));
}

function App() {
  console.log('App Rendered');
  const [isPending, startTransition] = useTransition();
  const [filterTerm, setFilterTerm] = useState('');
  const initialComments = [{ text: "hello", status: 'sent'}, { text: "this is a comment", status: 'sent'}];
  const filteredProducts = filterProducts(filterTerm);

  function updateFilterHandler(event) {
    startTransition(() => {
      setFilterTerm(event.target.value);
    });
  }

  return (
    <div id="app">
      {/* <input type="text" onChange={updateFilterHandler} /> */}
      {/* <ProductList products={filteredProducts} /> */}
      <CommentSection initialComments={initialComments} />
    </div>
  );
}

export default App;
