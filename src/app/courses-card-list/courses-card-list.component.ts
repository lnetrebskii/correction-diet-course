import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Course} from "../model/course";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {CourseDialogComponent} from "../course-dialog/course-dialog.component";
import {DietAuthService} from "../services/diet-auth.service";
import {Observable} from "rxjs";

@Component({
  selector: 'courses-card-list',
  templateUrl: './courses-card-list.component.html',
  styleUrls: ['./courses-card-list.component.css']
})
export class CoursesCardListComponent implements OnInit {

  @Input()
  courses: Course[];

  @Output()
  courseEdited = new EventEmitter();

  isAdmin$: Observable<boolean>;

  constructor(private dietAuthService: DietAuthService,
              private dialog: MatDialog) {
  }

  ngOnInit() {

    this.isAdmin$ = this.dietAuthService.isAdmin();

  }

  editCourse(course:Course) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = course;

    this.dialog.open(CourseDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe(val => {
        if (val) {
          this.courseEdited.emit();
        }
      });

  }

}
