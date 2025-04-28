Feature: Image editing functionality

  # Scenario 1: User views the image gallery
  Scenario: User views a list of images with pagination
    Given the user is on the image gallery page
    When they view the list of images
    Then they should see image previews with the author's name
    And the images should be paginated

  # Scenario 2: User clicks on an image to navigate to the edit page
  Scenario: User clicks on an image to navigate to the edit page
    Given the user is on the image gallery page
    When they click on an image
    Then they should be navigated to the image edit page

  # Scenario 3: User edits an image (select size, greyscale, blur)
  Scenario: User edits an image
    Given the user is on the image edit page
    When they adjust the image settings (size, greyscale, blur)
    Then the image preview should update

  # Scenario 4: User refreshes the page and the image settings are preserved
  Scenario: User refreshes the page and the image settings are preserved
    Given the user has edited the image
    When they refresh the page or navigate back
    Then the image settings should be preserved
    And the user should see the image with the same settings

  # Scenario 5: User goes back in history to the image edit page
  Scenario: User goes back in history and sees the same image
    Given the user is on the image edit page
    When they go back in their history
    Then the image and its settings should remain the same