import { ComponentFixture, TestBed } from '@angular/core/testing';

// 1. We must import 'LoginComponent' from the exact file name 'login.component'
import { LoginComponent } from './login'; 

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // 2. Update the imports array
      imports: [LoginComponent] 
    })
    .compileComponents();

    // 3. Update the component creation
    fixture = TestBed.createComponent(LoginComponent); 
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});