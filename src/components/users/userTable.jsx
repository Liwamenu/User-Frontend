//modules
import { useNavigate } from "react-router-dom";

//utils
import { copyToClipboard, formatDateString } from "../../utils/utils";

//comp
// import SendSMS from "./actions/sendSms";
import Actions from "./actions/actions";
import { CopyI } from "../../assets/icon";
// import SendEmail from "./actions/sendEmail";
import ChangeUsersStatus from "./userIsActive";
import ChangeUsersIsVerified from "./userIsVerified";

const UsersTable = ({ users, itemsPerPage, onSuccess }) => {
  const navigate = useNavigate();

  const handleClick = (user) => {
    navigate(`/users/restaurants/${user.id}`, { state: { user } });
  };

  return (
    <main className="max-xl:overflow-x-scroll">
      <div className="min-h-[30rem] border border-solid border-[--light-4] rounded-lg min-w-[60rem] overflow-hidden">
        <table className="w-full text-sm font-light">
          <thead>
            <tr className="bg-[--light-3] h-8 text-left text-[--black-1]">
              <th className="pl-4 font-normal">Ad Soyad</th>
              <th className="font-normal">Rol</th>
              <th className="font-normal">iletişim</th>
              <th className="font-normal">İl</th>
              <th className="font-normal">Durum</th>
              <th className="font-normal text-center">Onaylı</th>
              <th className="font-normal">Kayıt Tarihi</th>
              <th className="font-normal text-center">İşlem</th>
            </tr>
          </thead>

          <tbody>
            {users.map((data, index) => (
              <tr
                key={data.id}
                className={`odd:bg-[--white-1] even:bg-[--table-odd] h-14 border border-solid border-[--light-4] border-x-0 hover:bg-[--light-3] transition-colors ${
                  users.length < 8 ? "" : "last:border-b-0"
                } `}
              >
                <td
                  onClick={() => handleClick(data)}
                  className="whitespace-nowrap text-[--black-2] pl-4 font-normal cursor-pointer"
                >
                  {data.fullName}
                </td>
                <td
                  onClick={() => handleClick(data)}
                  className="whitespace-nowrap text-[--black-2] font-light cursor-pointer"
                >
                  {data.isDealer ? "Bayi" : "Musteri"}
                </td>
                <td className="whitespace-nowrap text-[--black-2] font-light cursor-pointer">
                  <div className="flex items-center justify-between pr-3 ">
                    <div
                      className="flex items-center group"
                      onClick={() =>
                        copyToClipboard({
                          text: data.phoneNumber,
                          msg: "Tel Kopyalandı",
                        })
                      }
                    >
                      <p className="text-[--gr-1]">{data.phoneNumber}</p>
                      <CopyI className="size-[16px] mx-1 opacity-0 group-hover:opacity-100 text-[--link-1]" />
                    </div>
                    {/* <div>
                      <SendSMS data={data} />
                    </div> */}
                  </div>

                  <div className="flex items-center justify-between pr-3 ">
                    <div
                      className="flex items-center group"
                      onClick={() =>
                        copyToClipboard({
                          text: data.email,
                          msg: "E-Posta Kopyalandı",
                        })
                      }
                    >
                      <p className="text-[--gr-1]">{data.email}</p>
                      <CopyI className="size-[16px] mx-1 opacity-0 group-hover:opacity-100 text-[--link-1]" />
                    </div>

                    {/* <div>
                      <SendEmail data={data} />
                    </div> */}
                  </div>
                </td>
                <td
                  onClick={() => handleClick(data)}
                  className="whitespace-nowrap text-[--black-2] font-light cursor-pointer"
                >
                  {data.city}
                </td>
                <td className="whitespace-nowrap text-[--black-2] font-light relative">
                  <ChangeUsersStatus user={data} onSuccess={onSuccess} />
                </td>
                <td className="whitespace-nowrap text-center text-[--black-2] font-light">
                  <ChangeUsersIsVerified user={data} onSuccess={onSuccess} />
                </td>
                <td
                  onClick={() => handleClick(data)}
                  className="whitespace-nowrap text-[--black-2] font-light cursor-pointer"
                >
                  {formatDateString(data.createdDateTime)}
                </td>
                <td className="w-14 text-[--black-2] font-light relative">
                  <Actions
                    index={index}
                    user={data}
                    itemsPerPage={itemsPerPage}
                    onSuccess={onSuccess}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default UsersTable;
