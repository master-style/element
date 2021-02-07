import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AttrComponent } from './attr/attr.component';
import { ClickableComponent } from './clickable/clickable.component';
import { ControlComponent } from './control/control.component';
import { EventComponent } from './event/event.component';
import { TargetComponent } from './target/target.component';

@NgModule({
    declarations: [
        AppComponent,
        AttrComponent,
        ClickableComponent,
        ControlComponent,
        TargetComponent,
        EventComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
