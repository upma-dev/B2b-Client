# Urban Lease - Project Structure

## Overview
This is a modular, organized B2B real estate portal for Urban Lease. The project has been restructured for better maintainability and scalability.

## Project Structure

### Root Files
- **index.html** - Main entry point (now acts as a template container)
- **styles.css** - All styling and design
- **script.js** - Main application logic
- **anchor-scroll.js** - Smooth scrolling functionality
- **package.json** - Project dependencies

### `/sections/` - Modular HTML Components
Each section of the website is now a separate HTML file for better organization:

- **header.html** - Navigation header with logo and menu
- **hero.html** - Hero slider section with 3 slides
- **stats.html** - Statistics counter section (Years, Acres, Brokers, etc.)
- **projects.html** - Portfolio projects slider (6 projects)
- **calculator.html** - Brokerage yield & commission calculator
- **rental-hub.html** - **KEY FEATURE**: Rental yield calculator + Lease request form
- **progress.html** - Construction progress timeline tracker

### `/js/` - JavaScript Utilities
- **section-loader.js** - Dynamically loads HTML sections into the main page

## Features

### 1. **Rental Hub & Lease Management** ✅
Located in `sections/rental-hub.html`

**Components:**
- **Rental Income Calculator** - Calculate annual yield based on property value
- **Available Properties** - Grid display of rental properties
- **Lease Request Form** - Submit rental requests for:
  - Property Name
  - Lease Type (Short/Long-term, Furnished/Unfurnished)
  - Monthly Rental Amount
  - Contact Information
  - Additional Details

### 2. **Brokerage Commission Calculator**
Calculate projected payouts based on sales volume and commission rates.

### 3. **Construction Progress Tracker**
Interactive timeline showing construction milestones for each project.

### 4. **White-Label Media Center** (To be added)
Broker assets download functionality.

## How Sections Load

The new `section-loader.js` file handles dynamic loading:

1. Page loads with empty containers
2. JavaScript fetches each HTML section file
3. Sections are inserted into designated containers
4. All scripts (script.js, anchor-scroll.js) run as normal

**Benefits:**
- ✅ Clean separation of concerns
- ✅ Easier to maintain individual sections
- ✅ Better collaboration (different sections can be worked on independently)
- ✅ Improved performance (sections can be lazy-loaded if needed)
- ✅ Clearer structure for new developers

## Development Workflow

### To Edit a Section:
1. Edit the corresponding file in `/sections/`
2. Changes appear immediately when page is refreshed
3. No need to edit the massive index.html file

### To Add a New Section:
1. Create a new HTML file in `/sections/`
2. Add the container `<div id="new-section-container"></div>` in index.html
3. Add entry to `loadSections()` in `js/section-loader.js`:
   ```javascript
   { id: 'new-section-container', file: 'sections/new-section.html' }
   ```

### To Modify Scripts:
- **Global functionality** → edit `script.js`
- **Scroll behavior** → edit `anchor-scroll.js`
- **Styling** → edit `styles.css`
- **Section loading** → edit `js/section-loader.js`

## Key Section: Rental Hub (Lease/Kiraye Feature)

This is the feature requested by your instructor for handling building rentals/leases.

**Location:** `sections/rental-hub.html`

**Features:**
1. **Calculate Rental Income** - Interactive sliders for property value and yield %
2. **View Available Properties** - Browse properties available for lease
3. **Submit Lease Request** - Form to register properties or submit tenant inquiries

**Form Fields:**
- Property Name (e.g., "Zayard Villa, Unit A101")
- Lease Type (Short/Long-term, Furnished/Unfurnished)
- Monthly Rental Amount (EGP)
- Contact Email
- Additional Details (textarea for special requirements)

## Technical Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Styling Framework:** Custom CSS with CSS variables for theming
- **Build Tool:** Vite (optional)
- **Font:** Playfair Display (headings), Plus Jakarta Sans (body)

## Color Scheme
- Primary: `#0A2F1D` (dark green)
- Accent: `#E5C158` (gold)
- Background Dark: `#070F0B`
- Background Light: `#F4F7F5`

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Future Enhancements

- [ ] Media Center - White-label asset download
- [ ] Vision/Mission section with values
- [ ] Testimonials carousel
- [ ] Contact form integration
- [ ] Database backend for lease submissions
- [ ] Real-time property search
- [ ] Advanced filtering for rental properties

## Notes

- All sections maintain the same styling and design language
- Custom cursor effects apply globally
- Smooth scroll animations are preserved
- Form validation is handled by browser defaults (can be enhanced)
- No external frameworks used (vanilla JS only)

---

**Project Version:** 1.0  
**Last Updated:** 2026-05-21  
**Structure:** Modular HTML Component Architecture
