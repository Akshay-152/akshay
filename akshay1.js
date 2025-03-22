
const background = document.getElementById('background');
const shapes = [];
const numShapes = 39;
const shapeTypes = ['triangle', 'square', 'circle'];

// Function to create and place a shape
function createShape(type) {
    const shape = document.createElement('div');
    shape.classList.add('shape', type);
    shape.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;

    if (type === 'triangle') {
        shape.style.borderBottomColor = shape.style.backgroundColor;
    }

    background.appendChild(shape);
    
    shapes.push({
        element: shape,
        position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
        velocity: { x: (Math.random() - 0.5) * 3, y: 0 },
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 2
    });
}

// Generate initial shapes
for (let i = 0; i < numShapes; i++) {
    createShape(shapeTypes[Math.floor(Math.random() * shapeTypes.length)]);
}

// Apply gravity and movement effects
function applyGravity() {
    const gravity = 0.14;
    const friction = 0.98;
    const bounce = -0.6;
    
    let needsUpdate = false;

    for (let shape of shapes) {
        shape.velocity.y += gravity;
        shape.velocity.x *= friction;
        shape.velocity.y *= friction;
        shape.rotation += shape.rotationSpeed;
        shape.position.y += shape.velocity.y;
        shape.position.x += shape.velocity.x;

        // Bounce off the bottom
        if (shape.position.y > window.innerHeight - 30) {
            shape.position.y = window.innerHeight - 30;
            shape.velocity.y *= bounce;
        }

        // Bounce off the sides
        if (shape.position.x < 0) {
            shape.position.x = 0;
            shape.velocity.x *= -0.7;
        } else if (shape.position.x > window.innerWidth - 30) {
            shape.position.x = window.innerWidth - 30;
            shape.velocity.x *= -0.7;
        }

        // Apply transform update only if needed
        shape.element.style.transform = `translate3d(${shape.position.x}px, ${shape.position.y}px, 0) rotate(${shape.rotation}deg)`;

        needsUpdate = true;
    }

    if (needsUpdate) {
        requestAnimationFrame(applyGravity);
    }
}

// Click event to scatter shapes
document.addEventListener('click', () => {
    for (let shape of shapes) {
        shape.velocity.x = (Math.random() - 0.5) * 20;
        shape.velocity.y = (Math.random() - 0.5) * -30;
        shape.rotationSpeed = (Math.random() - 0.5) * 20;
    }
});

// Debounce device orientation
let lastEventTime = 0;
window.addEventListener('deviceorientation', (event) => {
    const currentTime = Date.now();
    if (currentTime - lastEventTime < 100) return;
    lastEventTime = currentTime;

    const xTilt = event.gamma / 20;
    const yTilt = event.beta / 20;

    for (let shape of shapes) {
        shape.velocity.x += xTilt * 0.1;
        shape.velocity.y += yTilt * 0.5;
    }
});

// Start the animation
applyGravity();


      


// Function to toggle the dropdown menu
function toggleMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById("menuDropdown");
    const isOpen = menu.classList.toggle("show");
    menu.setAttribute("aria-hidden", !isOpen);
    event.currentTarget.setAttribute("aria-expanded", isOpen);
}

// Function to close the dropdown menu
function closeMenu() {
    const menu = document.getElementById("menuDropdown");
    if (menu.classList.contains("show")) {
        menu.classList.remove("show");
        menu.setAttribute("aria-hidden", "true");
        document.querySelector('.menu-button').setAttribute("aria-expanded", "false");
    }
}

// Handle option click
function handleOptionClick(event) {
    closeMenu(); // Close the menu when an option is clicked
}

// Close the menu if clicking outside of it
document.addEventListener('click', function(event) {
    const menu = document.getElementById("menuDropdown");
    if (menu.classList.contains("show")) {
        closeMenu();
    }
});


        // Mouse Follow Effect
        document.addEventListener('mousemove', (event) => {
            const mouseX = event.clientX;
            const mouseY = event.clientY;
            shapes.forEach(shape => {
                const dx = mouseX - shape.position.x;
                const dy = mouseY - shape.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    shape.velocity.x += dx * 0.005;
                    shape.velocity.y += dy * 0.005;
                }
            });
        });




        
if (!window.flow) { var flow = {}; }
if (!flow.linkWrapper) { flow.linkWrapper = {}; }

flow.linkWrapper.initialize = flow.linkWrapper.initialize || function() {
  console.log('flow.linkWrapper.initialize');

  function getCurrentPageUrl() {
    return window.location.href;
  }

  function wrapLink($element) {
    var $a = $element.find('a');
    var href = $a.prop('href');
    var currentPageUrl = getCurrentPageUrl();

    // Check if href has a value and if it's different from the current page URL
    if (href && href !== currentPageUrl) {
      $element.wrapInner(`<a href="${href}"></a>`);
      $element.addClass('cs-has-link');
    }
  }

  // Find cards of correct type
  $('.page-section[data-section-id="6640d3b13af22e242f90536f"] .user-items-list-simple .list-item').each(function() {
    console.log($(this));
    wrapLink($(this));
  });
};

$(document).ready(function() {
  flow.linkWrapper.initialize();
});


      
      
      
      
      
      