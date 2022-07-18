import smoothscroll from 'smoothscroll-polyfill';
import throttle from 'lodash.throttle';
import {
  createHtmlFragment,
  createButtonElement,
  getAnimationStyle,
} from './utils';
import './assets/main.css';

/**
 * Init polyfill
 * It will be replace standard browser scroll function
 * only if smooth scroll is not supported
 */
smoothscroll.polyfill();

// Keeps track of updates
const componentState = {
  isVisible: false,
};

const defaultOptions = {
  buttonText: '',
  iconElement: `
    <svg xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="#FFFFFF"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <polyline points="6 15 12 9 18 15"></polyline>
    </svg>
  `,
  iconBase64: '',
  iconUrl: '',
  scrollOffset: 400,
  animationType: 'fade',
};

/**
 * Button click handler
 * Scrolls to top using smooth scroll
 */
function clickHandler() {
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
}

/**
 * Throttled function for handling scroll event
 * Updates style of container element to show/hide it based on
 * scroll position
 */
const toggleButtonVisibility = throttle((htmlFragment, options) => {
  const { scrollOffset, animationType } = options;
  const yTopOffset = window.pageYOffset || window.scrollY;

  if (!componentState.isVisible && yTopOffset > scrollOffset) {
    htmlFragment.style = getAnimationStyle(animationType).in;
    componentState.isVisible = true;
  } else if (componentState.isVisible && yTopOffset < scrollOffset) {
    htmlFragment.style = getAnimationStyle(animationType).out;
    componentState.isVisible = false;
  }
}, 150);

/**
 * Initializes all template parts, creates elements and attaches
 * element listeners
 *
 * @param {options} options Component options
 */
const initScrollToTopButton = (options = {}) => {
  let resolvedOptions = defaultOptions;

  if (typeof options !== 'object' || options === null) {
    console.warn(
      `Expected options to be an object, but received ${typeof options}`
    );
  } else {
    // Merge user options with default ones
    resolvedOptions = { ...resolvedOptions, ...options };
  }

  const buttonElement = createButtonElement({
    buttonText: resolvedOptions.buttonText,
    iconOptions: {
      iconElement: resolvedOptions.iconElement,
      iconBase64: resolvedOptions.iconBase64,
      iconUrl: resolvedOptions.iconUrl,
      iconElement: resolvedOptions.iconElement,
    },
  });

  const htmlFragment = createHtmlFragment(buttonElement, {
    scrollOffset: resolvedOptions.scrollOffset,
    animationType: resolvedOptions.animationType,
  });

  // Handle DOM actions only when it's loaded
  window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('body').append(htmlFragment);

    // Handle scroll to top action when button is clicked
    buttonElement.addEventListener('click', clickHandler);

    // Handle on scroll changes
    document.addEventListener('scroll', () =>
      toggleButtonVisibility(htmlFragment, {
        scrollOffset: resolvedOptions.scrollOffset,
        animationType: resolvedOptions.animationType,
      })
    );
  });
};

export default initScrollToTopButton;
