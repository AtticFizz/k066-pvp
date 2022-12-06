namespace ReturnOfPVP.Helpers;

using AutoMapper;
using ReturnOfPVP.Entities;
using ReturnOfPVP.Entities.QuestionTypes;
using ReturnOfPVP.Models;
using ReturnOfPVP.Models.Accounts;
using ReturnOfPVP.Models.Questions;

public class AutoMapperProfile : Profile
{
    // mappings between model and entity objects
    public AutoMapperProfile()
    {
        CreateMap<string, bool>().ConvertUsing(s => bool.Parse(s));

        CreateMap<Account, AccountResponse>();

        CreateMap<Account, AuthenticateResponse>();

        CreateMap<RegisterRequest, Account>();

        CreateMap<CreateRequest, Account>();

        CreateMap<UpdateRequest, Account>()
            .ForAllMembers(x => x.Condition(
                (src, dest, prop) =>
                {
                    // ignore null & empty string properties
                    if (prop == null) return false;
                    if (prop.GetType() == typeof(string) && string.IsNullOrEmpty((string)prop)) return false;

                    // ignore null role
                    if (x.DestinationMember.Name == "Role" && src.Role == null) return false;

                    return true;
                }
            ));

        CreateMap<QuestionAnswerRequest, QuestionAnswer>();

        CreateMap<TrueFalseRequest, QuestionTrueFalse>();

        CreateMap<MultiChoiceRequest, QuestionMultiChoice>()
            .ForMember(d => d.QuestionAnswers, opt => opt.MapFrom(src => src.Answers));

        CreateMap<Question, QuestionResponse>().IncludeAllDerived();

        CreateMap<QuestionTrueFalse, TrueFalseResponse>();

        CreateMap<QuestionMultiChoice, MultiChoiceResponse>();

        CreateMap<QuizRequest, Quiz>().ForMember(dest => dest.Questions, opt => opt.Ignore());

        CreateMap<Quiz, QuizResponse>().ForMember(dest => dest.Questions, opt => opt.Ignore());
    }
}