/**
 * @fileoverview Component for displaying a "404 - Page Not Found" message.
 * 
 * @file src/pages/NoPages.js
 * 
 * This component is used to display a message indicating that the requested page does not exist.
 * It is typically rendered when a user navigates to a route that is not defined in the application.
 * 
 * @component
 * @returns {React.Element} - The rendered NoPage component with a "404 - Page Not Found" message.
 * 
 * @version 1.0.0
 * 
 * @author Steven Stansberry
 */

/**
 * NoPage component to display a "404 - Page Not Found" message.
 * 
 * This component is displayed when a user tries to access a non-existent route.
 * It provides a simple message to inform the user that the page they are looking for does not exist.
 * 
 * @component
 * @returns {React.Element} - The rendered NoPage component.
 */
function NoPage() {
    return (
      <>
        <h1>NoPage</h1>
      </>
    );
  }
  
  export default NoPage;
  