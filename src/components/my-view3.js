/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from '@polymer/lit-element';
import { PageViewElement } from './page-view-element.js';
import { SharedStyles } from './shared-styles.js';
import { ButtonSharedStyles } from './button-shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import './shop-products.js';
import './shop-cart.js';

// This element is connected to the redux store.
import { store } from '../store.js';

// These are the actions needed by this element.
import { checkout } from '../actions/shop.js';

// We are lazy loading its reducer.
import shop, { cartQuantitySelector } from '../reducers/shop.js';
store.addReducers({
  shop
});

class MyView3 extends connect(store)(PageViewElement) {
  _render({_quantity, _error}) {
    return html`
      ${SharedStyles}
      ${ButtonSharedStyles}
      <style>
        /* Add more specificity (.checkout) to workaround an issue in lit-element:
           https://github.com/PolymerLabs/lit-element/issues/34 */
        button.checkout {
          border: 2px solid var(--app-dark-text-color);
          border-radius: 3px;
          padding: 8px 16px;
        }
        button.checkout:hover {
          border-color: var(--app-primary-color);
          color: var(--app-primary-color);
        }
      </style>

      <section>
        <h2>Redux example: shopping cart</h2>
        <div class="circle">${_quantity}</div>

        <p>This is a slightly more advanced Redux example, that simulates a
          shopping cart: getting the products, adding/removing items to the
          cart, and a checkout action, that can sometimes randomly fail (to
          simulate where you would add failure handling). </p>
        <p>This view, as well as its 2 child elements, <code>&lt;shop-products&gt;</code> and
        <code>&lt;shop-cart&gt;</code> are connected to the Redux store.</p>
      </section>
      <section>
        <h3>Products</h3>
        <shop-products></shop-products>

        <br>
        <h3>Your Cart</h3>
        <shop-cart></shop-cart>

        <div>${_error}</div>
        <br>
        <p>
          <button class="checkout" hidden="${_quantity == 0}"
              on-click="${() => store.dispatch(checkout())}">
            Checkout
          </button>
        </p>
      </section>
    `;
  }

  static get properties() { return {
    // This is the data from the store.
    _quantity: Number,
    _error: String
  }}

  // This is called every time something is updated in the store.
  _stateChanged(state) {
    this._quantity = cartQuantitySelector(state);
    this._error = state.shop.error;
  }
}

window.customElements.define('my-view3', MyView3);
