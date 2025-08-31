# Frontend part of Final Project

This boilerplate is designed to give you a head start in your React projects, with a focus on understanding the structure and components. As a student of Technigo, you'll find this guide helpful in navigating and utilizing the repository.

## Getting Started

1.  Install the required dependencies using `npm install`.
2.  Start the development server using `npm run dev`.


Final Project
A project to get all knowledge together after a fast paced bootcamp, from zero to Hero, and challenge us to explore more of the world of tech.

The problem
Problem Approach:
I identified a gap in existing garden management applications - they were either too complex and overwhelming, or lacked essential functionality. My approach was to conduct a competitive analysis of available apps to understand what worked well and what didn't. I focused on creating a minimal viable product that prioritized core features while maintaining simplicity and user-friendliness.
Planning Process:

Research Phase: Analyzed existing garden apps to identify pain points and essential features
Feature Prioritization: Defined must-have functionality vs. nice-to-have features
Architecture Design: Planned a full-stack solution with clear separation of concerns
Technology Selection: Chose modern, well-supported technologies that would allow for future scalability

Technologies & Tools Used:
Frontend:

React with Vite for fast development and optimized builds
React Router for navigation management
Zustand for lightweight state management
Styled Components for component-based styling
React Hot Toast for user notifications
React Icons for consistent iconography
Axios for API communication

Backend:

Node.js with Express for the REST API
MongoDB with Mongoose for data persistence and modeling
bcrypt for secure password hashing
CORS for cross-origin request handling
dotenv for environment variable management

Data & Integration:

Plant API for comprehensive plant information
CSV processing with Papaparse for data import/export
Cheerio for web scraping plant data when needed
node-fetch for external API calls
crypto for generating secure tokens

Development Tools:

Nodemon for automatic server restarts during development

Next Steps with More Time:

Add seasonal planning tools

Drag and drop to create your own garden

Possibility to connect it to an offline calender

Seasonal Planning Tools:

Plant Calendar Integration: Implement a dynamic planting calendar that suggests optimal sowing, transplanting, and harvesting dates based on user location and last frost dates

Seasonal Task Management: Create automated reminders for seasonal garden tasks (pruning, fertilizing, pest control) with customizable scheduling

Crop Rotation Planning: Build a multi-year planning system that suggests crop rotation patterns to maintain soil health

Weather Integration: Connect with weather APIs to provide frost warnings and adjust planting recommendations based on seasonal forecasts

Drag and Drop Garden Designer:

Interactive Garden Layout: Implement a drag-and-drop interface using libraries like React DnD or React Beautiful DnD for visual garden bed planning


Offline Calendar Integration:

iCal/Google Calendar Sync: Implement calendar export functionality using iCal format for seamless integration with existing calendar apps


Technical Implementation Considerations:

Use React DnD for drag-and-drop functionality with touch support for mobile devices

Integrate date-fns or moment.js for robust date calculations and timezone handling

Consider Canvas API or SVG for more advanced garden visualization tools

These features would transform the app from a basic plant tracker into a comprehensive garden management and planning platform.


View it live
Frontend: https://lillebrorgrodafinalproject.netlify.app/

Backend: https://garden-backend-r6x2.onrender.com