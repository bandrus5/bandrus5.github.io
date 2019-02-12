import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BannerComponent } from './banner/banner.component';
import { PageContentComponent } from './page-content/page-content.component';
import { BrowsePageComponent } from './page-content/browse-page/browse-page.component';
import { YourStoriesPageComponent } from './page-content/your-stories-page/your-stories-page.component';
import { ReviewingPageComponent } from './page-content/reviewing-page/reviewing-page.component';
import { BrowseStoryCardComponent } from './page-content/browse-page/browse-story-card/browse-story-card.component';
import { StoryInfoModalComponent } from './story-info-modal/story-info-modal.component';
import { PostedStoryCardComponent } from './page-content/your-stories-page/posted-story-card/posted-story-card.component';

@NgModule({
  declarations: [
    AppComponent,
    BannerComponent,
    PageContentComponent,
    BrowsePageComponent,
    YourStoriesPageComponent,
    ReviewingPageComponent,
    BrowseStoryCardComponent,
    StoryInfoModalComponent,
    PostedStoryCardComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
