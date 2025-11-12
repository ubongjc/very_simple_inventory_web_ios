# Instructions for Creating HOW_TO_USE_VSI.pdf

## Overview
A comprehensive user manual has been created in `HOW_TO_USE_VSI.md`. This file contains detailed instructions for every feature in the VSI Rental Inventory Management System.

## Converting to PDF with Screenshots

### Option 1: Using Markdown to PDF Tools

**Recommended Tools:**
- **Pandoc** with LaTeX
- **Markdown PDF** (VS Code extension)
- **Typora** (WYSIWYG Markdown editor with export)
- **GitBook** or similar documentation platforms

### Option 2: Using Google Docs/Microsoft Word

1. Open `HOW_TO_USE_VSI.md` in a text editor
2. Copy the content
3. Paste into Google Docs or Word
4. Format as needed
5. Add screenshots where indicated by `**[Screenshot: ...]**` markers
6. Export as PDF

### Option 3: Using Online Converters

1. Use services like:
   - https://www.markdowntopdf.com/
   - https://cloudconvert.com/md-to-pdf
   - https://www.browserling.com/tools/markdown-to-pdf
2. Upload `HOW_TO_USE_VSI.md`
3. Download the PDF
4. Edit the PDF to add screenshots using:
   - Adobe Acrobat
   - PDF editing tools like PDFescape, Sejda, etc.

## Adding Screenshots

The markdown document includes 50+ placeholder locations marked with:
```
**[Screenshot: description of what to capture]**
```

### How to Take Screenshots

1. **Run the application** in your browser
2. **Navigate to each page** (Home, All Bookings, Inventory, Settings)
3. **Capture screenshots** for each placeholder:
   - Use browser screenshot tools (F12 → Device toolbar)
   - Use OS screenshot tools:
     - Windows: Snipping Tool or Win+Shift+S
     - Mac: Cmd+Shift+4
     - Linux: Screenshot app or import command
   - Use browser extensions like Awesome Screenshot

4. **Screenshot Checklist** (in order of appearance in document):

   **Getting Started:**
   - [ ] Application homepage with calendar view
   - [ ] Navigation bar on desktop and mobile

   **Home Page:**
   - [ ] Calendar with multiple bookings displayed
   - [ ] Item filter dropdown open with checkboxes
   - [ ] Day drawer open showing booking details
   - [ ] Add Item modal with all fields
   - [ ] Add Item modal showing validation errors with red borders
   - [ ] Add Booking modal - customer section
   - [ ] Add Booking modal - items section
   - [ ] Add Booking modal showing validation errors
   - [ ] Check Availability modal showing results

   **All Bookings Page:**
   - [ ] All Bookings page overview
   - [ ] Individual booking card with all details
   - [ ] Date range filter dropdown expanded
   - [ ] Status filter dropdown
   - [ ] Search in action with filtered results
   - [ ] Sort dropdown options
   - [ ] DEFAULT FILTERS button location
   - [ ] Default Filters dropdown open with all three selectors
   - [ ] Edit Booking modal
   - [ ] Delete confirmation modal
   - [ ] Booking statistics display

   **Inventory Page:**
   - [ ] Inventory page overview
   - [ ] Individual item card
   - [ ] Inventory statistics
   - [ ] Edit Item modal
   - [ ] Delete item confirmation modal with booking warning
   - [ ] Search in inventory
   - [ ] Inventory sort options

   **Settings Page:**
   - [ ] Settings page overview
   - [ ] Business information section
   - [ ] Currency settings section
   - [ ] Tax configuration
   - [ ] Inventory settings
   - [ ] Rental settings
   - [ ] Date and time settings
   - [ ] Save settings button and confirmation

   **Common Features:**
   - [ ] Form with validation errors showing red borders and messages
   - [ ] Notes field with character counter
   - [ ] Date picker popup
   - [ ] All four status badges (CONFIRMED, OUT, RETURNED, CANCELLED)
   - [ ] Application on desktop, tablet, and mobile
   - [ ] Button in loading state
   - [ ] Error message display

5. **Name screenshots consistently**:
   - Example: `01-homepage-calendar.png`
   - Example: `02-navigation-bar.png`
   - Example: `03-item-filter-dropdown.png`
   - etc.

6. **Insert screenshots** into the PDF at the marked locations

### Screenshot Best Practices

- Use consistent browser window size (recommend 1920x1080 for desktop views)
- Show realistic test data (not empty screens)
- Capture full modals/dropdowns in open state
- Highlight important buttons or areas if needed
- Use high resolution/quality settings
- Crop unnecessary browser chrome (address bar, bookmarks, etc.)

## Final PDF Filename

Save the final document as: **HOW_TO_USE_VSI.pdf**

(Note: The original request mentioned "HOW)TO_USE_VSI.pdf" but the underscore version is more standard for filenames)

## Document Maintenance

When updating the application:
1. Update `HOW_TO_USE_VSI.md` with new features
2. Take new screenshots as needed
3. Regenerate the PDF
4. Version the PDF (e.g., HOW_TO_USE_VSI_v1.1.pdf)

---

## Quick Command Examples

### Using Pandoc (if installed):
```bash
# Basic conversion
pandoc HOW_TO_USE_VSI.md -o HOW_TO_USE_VSI.pdf

# With custom styling
pandoc HOW_TO_USE_VSI.md -o HOW_TO_USE_VSI.pdf \
  --toc \
  --toc-depth=2 \
  --pdf-engine=xelatex \
  -V geometry:margin=1in
```

### Using Markdown PDF (VS Code):
1. Open `HOW_TO_USE_VSI.md` in VS Code
2. Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
3. Type "Markdown PDF: Export (pdf)"
4. Press Enter
5. PDF will be created in the same directory

---

**Note**: Screenshots are essential for a complete user manual. The markdown document is comprehensive but screenshots will make it much more user-friendly and easier to follow.
