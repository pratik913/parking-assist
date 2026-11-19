import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
@Component({
  selector: "pa-my-bookings",
  standalone: true,
  imports: [RouterLink],
  template: `<section class="page bookings">
    <span class="eyebrow">Your parking activity</span>
    <h1>My <em>bookings.</em></h1>
    <p class="muted">
      Keep track of reservations and parking sessions in one place.
    </p>
    <div class="tabs">
      <span class="active">Upcoming</span><span>Active</span
      ><span>Completed</span><span>Cancelled</span>
    </div>
    <div class="card empty">
      <div class="icon">◷</div>
      <h2>Your bookings will appear here.</h2>
      <p>
        Sign in to see your reservations. This initial frontend does not contain
        account or booking records.
      </p>
      <a class="btn primary" routerLink="/discover">Find parking</a
      ><a class="secondary" routerLink="/sign-in">Sign in</a>
    </div>
  </section>`,
  styles: [
    `
      .bookings {
        padding: 55px 0;
        min-height: 570px;
      }
      .bookings h1 {
        font: 800 38px Manrope;
        letter-spacing: -1.5px;
        margin: 8px 0;
      }
      .bookings h1 em {
        font-style: normal;
        color: #176b55;
      }
      .bookings > p {
        font-size: 13px;
      }
      .tabs {
        display: flex;
        gap: 22px;
        border-bottom: 1px solid #e5eaf0;
        margin-top: 30px;
        color: #8995a4;
        font-size: 12px;
      }
      .tabs span {
        padding: 14px 3px;
      }
      .tabs .active {
        color: #176b55;
        font-weight: 800;
        border-bottom: 2px solid #176b55;
      }
      .empty {
        margin: 30px auto;
        padding: 45px 20px;
        max-width: 560px;
        text-align: center;
        box-shadow: none;
      }
      .icon {
        font-size: 35px;
        color: #176b55;
      }
      .empty h2 {
        font: 700 20px Manrope;
      }
      .empty p {
        font-size: 12px;
        color: #718096;
        line-height: 1.7;
        max-width: 350px;
        margin: 0 auto 20px;
      }
      .secondary {
        display: block;
        color: #176b55;
        font-size: 12px;
        font-weight: 700;
        margin-top: 15px;
      }
      @media (max-width: 500px) {
        .tabs {
          gap: 13px;
          overflow: auto;
          white-space: nowrap;
        }
        .bookings h1 {
          font-size: 32px;
        }
      }
    `,
  ],
})
export class MyBookingsPageComponent {}
