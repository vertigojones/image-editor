@scenario1
Feature: Image editing functionality

  # Scenario 1: User views a list of images with pagination
  @scenario1
  Scenario: User views a list of images with pagination
    Given the user is on the image gallery page
    When they view the list of images
    Then they should see image previews with the author's name
    And the images should be paginated

  # Scenario 2: User clicks on an image to navigate to the edit page
  @scenario2
  Scenario: User clicks on an image to navigate to the edit page
    Given the user is on the image gallery page
    When they click on an image
    Then they should be navigated to the image edit page
