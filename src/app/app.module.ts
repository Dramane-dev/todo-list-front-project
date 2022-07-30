import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotifierModule } from 'angular-notifier';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { BallComponent } from './components/ball/ball.component';
import { SigninComponent } from './pages/auth/signin/signin.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { ButtonComponent } from './components/button/button.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TaskComponent } from './components/task/task.component';
import { PopupComponent } from './components/popup/popup.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ConfirmedMailComponent } from './pages/confirmed-mail/confirmed-mail.component';
import { CustomTranslateLoader } from './translate/customTranslateLoader';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        HomeComponent,
        BallComponent,
        SigninComponent,
        SignupComponent,
        ButtonComponent,
        DashboardComponent,
        TaskComponent,
        PopupComponent,
        SettingsComponent,
        ConfirmedMailComponent,
    ],
    imports: [
        BrowserModule,
        LayoutModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: CustomTranslateLoader,
                deps: [HttpClient],
            },
        }),
        MatIconModule,
        DragDropModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        NotifierModule.withConfig({
            behaviour: {
                autoHide: 2500,
            },
            position: {
                horizontal: {
                    position: 'middle',
                },
                vertical: {
                    position: 'top',
                },
            },
        }),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
