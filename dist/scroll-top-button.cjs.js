/*!
 * scroll-top-button
 * 
 *
 * @version v1.0.0
 * @author 
 * @license ISC
 */

'use strict';

var smoothscroll = require('smoothscroll-polyfill');
var throttle = require('lodash.throttle');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var smoothscroll__default = /*#__PURE__*/_interopDefaultLegacy(smoothscroll);
var throttle__default = /*#__PURE__*/_interopDefaultLegacy(throttle);

const baseClassName = 'scroll-to-top-button';

/**
 * Css styles managed by library
 */
const STYLE = {
  fade: {
    out: 'opacity: 0; visibility: none;',
    in: 'opacity: 1; visibility: visible',
  },
  scale: {
    out: '-moz-transform: scale(0); -webkit-transform: scale(0); -o-transform: scale(0); -ms-transform: scale(0);transform: scale(0);',
    in: '-moz-transform: scale(1); -webkit-transform: scale(1); -o-transform: scale(1); -ms-transform: scale(1);transform: scale(1);',
  },
};

/**
 * Constructs and logs error message
 *
 * @param {string} input Received input option
 * @param {string} toBe Expected type
 * @param {string} received Received type
 */
function reportErrorMessage(input, toBe, received) {
  console.warn(`Expected ${input} to be ${toBe}, but received ${received}`);
}

/**
 * Checks if input value is non empty string
 *
 * @param {any} input Value to check
 */
function isValidString(input) {
  return typeof input === 'string' && input;
}

/**
 * Resolves animation type and returns style
 *
 * @param {string} animationType Type of animation (options: fade, scale)
 */
function getAnimationStyle(animationType) {
  let type = animationType;

  if (!isValidString(animationType)) {
    reportErrorMessage('options.animationType', 'string', typeof animationType);
    type = 'fade';
  }

  return STYLE[type] || STYLE.fade;
}

/**
 * Generates button icon template and returns it as a string
 *
 * @param {object} options Icon template options
 */
function getIconTemplate(options) {
  const { iconElement, iconBase64, iconUrl } = options;

  let icon = '';
  if (iconBase64) {
    icon = `
      <img
        style="background-image: url('${iconBase64}')"
      />
    `;
  } else if (iconUrl) {
    icon = `
      <img
        style="background-image: url('${iconUrl}')"
      />
    `;
  } else if (iconElement) {
    icon = iconElement;
  }

  if (!icon) {
    return '';
  }

  const iconTemplate = `
    <div
      class="${baseClassName}__icon-wrapper"
    >
      ${icon}
    </div>
  `;

  return iconTemplate;
}

/**
 * Generates button text template and returns it as a string
 *
 * @param {object} options Button text template options
 */
function getButtonTextTemplate(options) {
  const { buttonText } = options;

  if (!isValidString(buttonText)) {
    return '';
  }

  const buttonTextTemplate = `
    <span
      class="${baseClassName}__text"
    >
      ${buttonText}
    </span>
  `;

  return buttonTextTemplate;
}

/**
 * Creates button element including icon and button text templates
 *
 * @param {object} options Button element options
 */
function createButtonElement(options) {
  const element = document.createElement('button');
  element.classList.add(`${baseClassName}__button`);

  element.innerHTML = `
    ${getIconTemplate(options.iconOptions)}
    ${getButtonTextTemplate(options.buttonText)}
  `;

  return element;
}

/**
 * Creates container for button element (scroll to top button)
 * Button is attached as a child
 *
 * @param {*} buttonElement Button element
 * @param {*} options Options object
 */
function createHtmlFragment(buttonElement, options) {
  const { animationType } = options;
  const baseElement = document.createElement('div');

  baseElement.classList.add(`${baseClassName}__container`);
  baseElement.appendChild(buttonElement);

  // It should be hidden initially
  baseElement.style = getAnimationStyle(animationType).out;

  return baseElement;
}

/**
 * Init polyfill
 * It will be replace standard browser scroll function
 * only if smooth scroll is not supported
 */
smoothscroll__default['default'].polyfill();

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
const toggleButtonVisibility = throttle__default['default']((htmlFragment, options) => {
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

module.exports = initScrollToTopButton;
