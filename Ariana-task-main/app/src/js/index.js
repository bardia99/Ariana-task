let rowCount = 0;
$(document).ready(function () {
  getTable();
  $(".datepicker").pDatepicker({
    initialValue: false,
    autoClose: true,
    format: "YYYY/MM/DD",
  });
  $("#skils").select2({
    dropdownParent: $("#createUserModal"),
  });
  $("#editSkils").select2({
    dropdownParent: $("#editUserModal"),
  });
  iziToast.settings({
    timeout: 3000,
    resetOnHover: true,
    transitionIn: "flipInX",
    transitionOut: "flipOutX",
    position: "topRight",
  });
});
$(document).on("click", "#openModal", function () {
  $("#createUserModal").modal("show");
});
let users = [];
$(document).on("click", "#submitInfo", function () {
  validation = false;
  validation = InputValidation($("#firstName"), validation);
  validation = InputValidation($("#lastName"), validation);
  validation = InputValidation($("#age"), validation);
  validation = InputValidation($("#skils"), validation);
  if (validation)
    iziToast.warning({
      icon: "",
      messageColor: "#fff",
      message: "Fill Every Inputs",
    });
  else {
    rowCount++;
    users.push({
      id: rowCount,
      firstName: $("#firstName").val(),
      lastName: $("#lastName").val(),
      age: $("#age").val(),
      skils: $("#skils").val(),
    });
    if (localStorage.getItem("user")) {
      const data = JSON.parse(localStorage.getItem("user"));
      data.push(...users);
      localStorage.setItem("user", JSON.stringify(data));
    } else {
      localStorage.setItem("user", JSON.stringify(users));
    }
    users = [];
    getTable();
    $("#firstName").val("");
    $("#lastName").val("");
    $("#age").val("");
    $("#skils").val("").trigger("change");
    $("#createUserModal").modal("hide");
  }
});

$(document).on("click", ".delete-row", function () {
  rowCount--;
  const $thisAttrId = parseInt($(this).attr("data-id"));
  $(this).parents("tr").remove();
  if (localStorage.getItem("user")) {
    const data = JSON.parse(localStorage.getItem("user"));
    const indexOfRow = data.findIndex((row) => row.id === $thisAttrId);
    if (indexOfRow !== -1) data.splice(indexOfRow, 1);
    localStorage.setItem("user", JSON.stringify(data));
    getTable();
  }
});
let $thisAttrId = "";
$(document).on("click", ".edit-row", function () {
  $("#editUserModal").modal("show");
  $thisAttrId = parseInt($(this).attr("data-id"));
  if (localStorage.getItem("user")) {
    const data = JSON.parse(localStorage.getItem("user"));
    const indexOfRow = data.findIndex((row) => row.id === $thisAttrId);
    if (indexOfRow !== -1) {
      $("#editFirstName").val(data[indexOfRow].firstName);
      $("#editLastName").val(data[indexOfRow].lastName);
      $("#editAge").val(data[indexOfRow].age);
      $("#editSkils").val(data[indexOfRow].skils).trigger("change");
    }
  }
});

$(document).on("click", "#editInfo", function () {
  validation = false;
  validation = InputValidation($("#editFirstName"), validation);
  validation = InputValidation($("#editLastName"), validation);
  validation = InputValidation($("#editAge"), validation);
  validation = InputValidation($("#editSkils"), validation);
  if (validation)
    iziToast.warning({
      icon: "",
      messageColor: "#fff",
      message: "Fill Every Inputs",
    });
  else {
    if (localStorage.getItem("user")) {
      const data = JSON.parse(localStorage.getItem("user"));
      const indexOfRow = data.findIndex((row) => row.id === $thisAttrId);
      if (indexOfRow !== -1) {
        data[indexOfRow].firstName = $("#editFirstName").val();
        data[indexOfRow].lastName = $("#editLastName").val();
        data[indexOfRow].age = $("#editAge").val();
        data[indexOfRow].skils = $("#editSkils").val();
        localStorage.setItem("user", JSON.stringify(data));
      }
    }
    $("#editFirstName").val("");
    $("#editLastName").val("");
    $("#editAge").val("");
    $("#editSkils").val("").trigger("change");
    $("#editUserModal").modal("hide");
    getTable();
  }
});

function getTable() {
  if (localStorage.getItem("user")) {
    const data = JSON.parse(localStorage.getItem("user"));
    $("#infoTable").empty();
    for (let i = 0; i < data.length; i++) {
      $("#infoTable").append(`
            <tr>
                <td>${[i + 1]}</td>
                <td>${data[i].firstName}</td>
                <td>${data[i].lastName}</td>
                <td><span class="badge text-bg-secondary">${calculateAge(
                  data[i].age
                )}</span></td>
                <td>${createBadge(data[i].skils)}</td>
                <td>
                    <button type="button" class="btn delete-row" data-id= "${
                      data[i].id
                    }">
                        <img src="../icons/delete.svg" width="18" height="18">
                    </button>
                    <button type="button" class="btn edit-row" data-id=${
                      data[i].id
                    }>
                        <img src="../icons/edit.svg" width="18" height="18">
                    </button>
                </td>
            </tr>
            `);
    }
    rowCount = data.length;
  }
}

function createBadge(data) {
  let badge = "";
  if (data && data.length) {
    for (let i = 0; i < data.length; i++)
      badge += `<span class="badge text-bg-danger">${data[i]}</span>
  `;

    return badge;
  }
}

function calculateAge(data) {
  const birthDay = moment(faToEn(data), "jYYYY/jMM/jDD").format("YYYY/MM/DD");
  const DOB = new Date(birthDay);
  const today = new Date();
  let age = today.getTime() - DOB.getTime();
  age = Math.floor(age / (1000 * 60 * 60 * 24 * 365.25));
  return age;
}
function faToEn(str) {
  let persianNumbers = [
    /۰/g,
    /۱/g,
    /۲/g,
    /۳/g,
    /۴/g,
    /۵/g,
    /۶/g,
    /۷/g,
    /۸/g,
    /۹/g,
  ];
  let arabicNumbers = [
    /٠/g,
    /١/g,
    /٢/g,
    /٣/g,
    /٤/g,
    /٥/g,
    /٦/g,
    /٧/g,
    /٨/g,
    /٩/g,
  ];
  if (typeof str === "string") {
    for (var i = 0; i < 10; i++) {
      str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
    }
  }
  return str;
}
function InputValidation(inp, validation, type) {
  let v = validation;
  if ($(inp).val() === "" || $(inp).val() === "-1") {
    v = true;
  }
  return v;
}
