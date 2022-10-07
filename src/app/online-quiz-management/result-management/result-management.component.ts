import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { OnlineQuizAdminService } from 'src/app/service/online-quiz-admin.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-result-management',
  templateUrl: './result-management.component.html',
  styleUrls: ['./result-management.component.scss']
})
export class ResultManagementComponent implements OnInit {

  taskList: any[] = [];
  selectedItem?: any;

  fullName?: string;
  categoryList: any;
  quizList: any;

  categorySelected: any;
  quizSelected: any;
  statusSelected: any;


  constructor(
    private activeRoute: ActivatedRoute,
    private onlineQuizAdminService: OnlineQuizAdminService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {

    this.onlineQuizAdminService.getTask().subscribe(res => {
      this.taskList = this.mapTask(res);
    });

    this.onlineQuizAdminService.getCategory().subscribe(res => this.categoryList = res);
    this.onlineQuizAdminService.getQuiz().subscribe(res => {
      this.quizList = res

      this.activeRoute.queryParams.subscribe((params: any) => {
        if (params.quiz) {
          this.quizSelected = res.filter((x: any) => x.quizId == params.quiz)[0];
          this.filter();
        }
      })

    });

  }

  refresh() {
    this.ngOnInit();
  }

  mapTask(res: any) {
    res.map((itemTask: any) => {
      itemTask['fullName'] = `${itemTask.user.firstName} ${itemTask.user.lastName}`;
      itemTask['time'] = this.calTime(itemTask.taskStart.slice(0, -5), itemTask.taskFinish.slice(0, -5));
    })
    return res;
  }

  filter() {
    const categoryId = this.categorySelected?.categoryId
    const quizId = this.quizSelected?.quizId
    let status;

    if (this.statusSelected && this.statusSelected.length == 1) {
      status = (this.statusSelected[0] == 'Pass').toString()
    } else {
      status = null;
    }

    const query = [];

    if (this.fullName) query.push(`fullName=${this.fullName.toLowerCase()}`)
    if (categoryId) query.push(`categoryId=${categoryId}`)
    if (quizId) query.push(`quizId=${quizId}`)
    if (status) query.push(`status=${status}`)

    this.onlineQuizAdminService.getTaskFilter(query.join('&')).subscribe(res => this.taskList = this.mapTask(res));
  }

  calTime(start: number, finish: number) {
    const diff = new Date(finish).getTime() - new Date(start).getTime();

    let msec = diff;
    const hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;

    const mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;

    const ss = Math.floor(msec / 1000);
    msec -= ss * 1000;

    return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
  }

  deleteItem(task: any) {
    this.confirmationService.confirm({
      message: 'คุณแน่ใจหรือว่าต้องการลบผลลัพธ์ของ ' + task.fullName + '?',
      header: 'ยืนยัน',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onlineQuizAdminService.deleteTask(task).subscribe({
          complete: () => {
            this.refresh();
            this.onlineQuizAdminService.alertMsg('success', 'สำเร็จ', `ระบบลบ ${task.fullName} สำเร็จแล้ว`);
          },
          error: () => {
            this.onlineQuizAdminService.alertMsg('error', 'ผิดพลาด', 'มีบางอย่างผิดพลาด');
          }
        });
      }
    });
  }

  deleteSelectedItem() {
    this.confirmationService.confirm({
      message: 'คุณแน่ใจหรือไม่ว่าต้องการลบผลลัพธ์ที่เลือก?',
      header: 'ยืนยัน',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        [...this.selectedItem].forEach((item, index) => {

          setTimeout(() => {
            this.onlineQuizAdminService.deleteTask(item).subscribe({
              complete: () => {
                if (index === this.selectedItem?.length - 1) {
                  this.refresh();
                  this.selectedItem = null;
                }
                this.onlineQuizAdminService.alertMsg('success', 'สำเร็จ', `ระบบลบผลลัพธ์ของ ${item.fullName} สำเร็จแล้ว`);
              },
              error: () => {
                this.onlineQuizAdminService.alertMsg('error', 'ผิดพลาด', `ระบบไม่สามารถลบผลลัพธ์ของ ${item.fullName} ได้`);
              }
            })
          }, index * 200)

        })
      }
    });
  }

  exportExcel() {

    const taskList: any = [];

    for (let task of [...this.taskList]) {
      taskList.push({
        name: task.fullName,
        category: task.quiz.category.categoryName,
        quiz: task.quiz.quizName,
        score: task.taskScore,
        result: task.taskPass,
        status: task.taskStatus ? 'Pass' : 'Not pass',
        time: task.time
      })
    }

    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(taskList);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "results");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }


}
