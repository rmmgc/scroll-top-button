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

export { createHtmlFragment, createButtonElement, getAnimationStyle };
