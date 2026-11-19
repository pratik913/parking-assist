import { Component, computed, inject } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
interface Detail {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly address: string;
  readonly description: string;
  readonly hourlyRate: number;
  readonly rating: number;
  readonly reviews: number;
  readonly distance: string;
  readonly features: readonly string[];
  readonly rules: readonly string[];
  readonly images: readonly string[];
}
const DETAILS: Readonly<Record<string, Detail>> = {
  "sample-1": {
    id: "sample-1",
    name: "Green Park Residency",
    type: "Private parking · Preview listing",
    address: "Hinjawadi Phase 1, Pune, Maharashtra",
    description:
      "A sample private parking listing to demonstrate the product experience. Actual access, owner authorization and availability must be verified by the platform before a real reservation can be offered.",
    hourlyRate: 30,
    rating: 4.8,
    reviews: 42,
    distance: "0.4 km from destination",
    features: [
      "Covered parking",
      "CCTV listed by host",
      "Vehicle entry assistance",
      "24-hour access (host supplied)",
    ],
    rules: [
      "Park only in the assigned bay.",
      "Follow on-site access instructions.",
      "Do not block driveways or emergency access.",
    ],
    images: [
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506529934140-6a7b2a7a6b2b?auto=format&fit=crop&w=900&q=80",
    ],
  },
  "sample-2": {
    id: "sample-2",
    name: "Central Plaza Parking",
    type: "Authorized public parking · Preview listing",
    address: "Baner Road, Pune, Maharashtra",
    description:
      "A sample public parking facility card. Public authorization evidence, tariffs and operating hours must be validated before production availability is shown.",
    hourlyRate: 50,
    rating: 4.6,
    reviews: 118,
    distance: "0.8 km from destination",
    features: ["EV charging listed", "Security desk", "Marked parking bays"],
    rules: [
      "Follow facility signage and attendant directions.",
      "Applicable facility tariff and restrictions prevail.",
    ],
    images: [
      "https://images.unsplash.com/photo-1506529934140-6a7b2a7a6b2b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=900&q=80",
    ],
  },
  "sample-3": {
    id: "sample-3",
    name: "Orchid Business Hub",
    type: "Private parking · Preview listing",
    address: "Wakad, Pune, Maharashtra",
    description:
      "A sample private parking listing. The listing is illustrative and is not a live offer of a parking space.",
    hourlyRate: 25,
    rating: 4.5,
    reviews: 27,
    distance: "1.2 km from destination",
    features: ["Covered parking", "Wide bays"],
    rules: ["Use only the assigned bay.", "Respect property access rules."],
    images: [
      "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=900&q=80",
    ],
  },
};
@Component({
  selector: "pa-parking-detail",
  standalone: true,
  imports: [RouterLink],
  template: `@if (listing(); as item) {
      <section class="page detail">
        <a routerLink="/discover" class="back">← Back to results</a>
        <div class="title-row">
          <div>
            <span class="eyebrow">Parking details</span>
            <h1>{{ item.name }}</h1>
            <p class="muted">{{ item.address }}</p>
          </div>
          <span class="preview">SAMPLE PREVIEW · NOT BOOKABLE</span>
        </div>
        <div class="gallery">
          <img [src]="item.images[0]" [alt]="item.name + ' parking area'" /><img
            [src]="item.images[1]"
            alt="Illustrative parking facility view"
          />
        </div>
        <div class="columns">
          <div class="main">
            <div class="summary card">
              <div>
                <span class="kind">{{ item.type }}</span>
                <h2>Parking that fits your plans.</h2>
                <p>{{ item.description }}</p>
                <div class="meta">
                  <span
                    >★ {{ item.rating }} · {{ item.reviews }} sample
                    reviews</span
                  ><span>⌖ {{ item.distance }}</span>
                </div>
              </div>
            </div>
            <section class="section">
              <h2>What this listing offers</h2>
              <div class="feature-grid">
                @for (feature of item.features; track feature) {
                  <div>✓ {{ feature }}</div>
                }
              </div>
            </section>
            <section class="section">
              <h2>Parking rules</h2>
              <ul>
                @for (rule of item.rules; track rule) {
                  <li>{{ rule }}</li>
                }
              </ul>
            </section>
            <div class="disclaimer">
              Listing content and images are illustrative. The production
              application will display verified evidence, exact entrance
              information, space-specific restrictions and live availability
              from the backend.
            </div>
          </div>
          <aside class="card reserve">
            <span class="muted">Starting rate</span>
            <div class="rate">₹{{ item.hourlyRate }} <small>/ hour</small></div>
            <p>
              Final amount depends on confirmed duration, fees and applicable
              taxes.
            </p>
            <a class="btn primary" [routerLink]="['/booking/review', item.id]"
              >Review reservation →</a
            ><small
              >Preview only · no space is held and no payment can be
              made.</small
            >
          </aside>
        </div>
      </section>
    } @else {
      <section class="page not-found">
        <h1>Parking listing not found</h1>
        <p class="muted">This preview listing may no longer be available.</p>
        <a class="btn primary" routerLink="/discover">Back to discovery</a>
      </section>
    }`,
  styles: [
    `
      .detail {
        padding: 34px 0 15px;
      }
      .back {
        font-size: 13px;
        color: #176b55;
        font-weight: 700;
      }
      .title-row {
        display: flex;
        justify-content: space-between;
        align-items: end;
        margin: 24px 0 20px;
        gap: 16px;
      }
      h1 {
        font: 800 38px Manrope;
        letter-spacing: -1.4px;
        margin: 8px 0;
      }
      .title-row p {
        margin: 0;
      }
      .preview {
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.07em;
        color: #80551c;
        background: #fff1d8;
        padding: 9px 12px;
        border-radius: 8px;
      }
      .gallery {
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        gap: 12px;
        height: 330px;
      }
      .gallery img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 16px;
      }
      .columns {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 310px;
        gap: 25px;
        margin-top: 24px;
      }
      .summary {
        padding: 23px;
        box-shadow: none;
      }
      .kind {
        font-size: 11px;
        font-weight: 800;
        color: #176b55;
      }
      .summary h2,
      .section h2 {
        font: 700 21px Manrope;
        margin: 10px 0;
      }
      .summary p,
      .reserve p {
        font-size: 13px;
        line-height: 1.7;
        color: #718096;
      }
      .meta {
        display: flex;
        gap: 18px;
        flex-wrap: wrap;
        font-size: 11px;
        color: #596a7e;
        margin-top: 15px;
      }
      .section {
        padding: 22px 4px;
      }
      .feature-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
        font-size: 13px;
        color: #536478;
      }
      .section li {
        font-size: 13px;
        color: #536478;
        line-height: 1.8;
      }
      .disclaimer {
        background: #f0f4f2;
        border-radius: 10px;
        padding: 15px;
        color: #627568;
        font-size: 11px;
        line-height: 1.6;
      }
      .reserve {
        padding: 22px;
        height: max-content;
        position: sticky;
        top: 100px;
        box-shadow: none;
      }
      .rate {
        font: 800 30px Manrope;
        margin-top: 5px;
      }
      .rate small {
        font: 500 12px "DM Sans";
        color: #718096;
      }
      .reserve .btn {
        width: 100%;
        margin: 10px 0;
      }
      .reserve > small {
        display: block;
        color: #8b795a;
        font-size: 10px;
        line-height: 1.5;
      }
      .not-found {
        padding: 80px 0;
        min-height: 450px;
      }
      @media (max-width: 760px) {
        .title-row {
          align-items: flex-start;
          flex-direction: column;
        }
        h1 {
          font-size: 30px;
        }
        .gallery {
          height: auto;
          grid-template-columns: 1fr;
        }
        .gallery img {
          height: 220px;
        }
        .gallery img + img {
          display: none;
        }
        .columns {
          grid-template-columns: 1fr;
        }
        .reserve {
          position: static;
        }
        .feature-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ParkingDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly listing = computed(
    () => DETAILS[this.route.snapshot.paramMap.get("id") ?? ""] ?? null,
  );
}
