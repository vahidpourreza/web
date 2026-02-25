USE accessdb;
GO

DECLARE @BrokerId   UNIQUEIDENTIFIER = '4ED7B685-E82D-43BA-A7CF-86B0C971050F';
DECLARE @BusinessId UNIQUEIDENTIFIER = 'CD5E5D4B-B81F-4266-BA0A-82455B729565';
DECLARE @Hash       NVARCHAR(256)    = N'$2a$11$ZJoDqleC1cowl8fhDCHPBuX8L3c9AHhAb/wwL.SakDV2w6/YjowVa';

WITH nums AS (
    SELECT TOP 100 ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
    FROM sys.all_objects
)
INSERT INTO Users
    (Username, FullName, Email, BirthDay, Mobile, Password,
     Gender, Status, Role, Language,
     BrokerId, IsRoot, CreatedByUserId, CreatedDateTime, BusinessId, AvatarId)
SELECT
    -- Username: null for every 3rd user
    CASE WHEN n % 3 = 0 THEN NULL
         ELSE N'user' + CAST(1000 + n AS NVARCHAR)
    END,

    -- FullName = FirstName|LastName  (Persian, gender-split by n%2)
    CASE n % 2
        WHEN 0 THEN CASE n % 10
                        WHEN 0 THEN N'علی'   WHEN 2 THEN N'محمد'
                        WHEN 4 THEN N'حسین'  WHEN 6 THEN N'رضا'
                        WHEN 8 THEN N'مهدی'  ELSE        N'امیر'
                    END
        ELSE       CASE n % 10
                        WHEN 1 THEN N'فاطمه' WHEN 3 THEN N'زهرا'
                        WHEN 5 THEN N'مریم'  WHEN 7 THEN N'سارا'
                        WHEN 9 THEN N'نگار'  ELSE        N'الناز'
                    END
    END
    + N'|' +
    CASE n % 10
        WHEN 0 THEN N'محمدی'  WHEN 1 THEN N'رضایی'
        WHEN 2 THEN N'حسینی'  WHEN 3 THEN N'احمدی'
        WHEN 4 THEN N'کریمی'  WHEN 5 THEN N'موسوی'
        WHEN 6 THEN N'جعفری'  WHEN 7 THEN N'عباسی'
        WHEN 8 THEN N'نجفی'   WHEN 9 THEN N'صادقی'
    END,

    -- Email: only every 4th user
    CASE WHEN n % 4 = 0
         THEN N'user' + CAST(1000 + n AS NVARCHAR) + N'@example.com'
         ELSE NULL
    END,

    -- BirthDay: ages ~18–47, day spread via prime multiplier
    DATEADD(DAY, (n * 53) % 365,
        DATEADD(YEAR, -(18 + n % 30), '2007-06-15')),

    -- Mobile: 09121000001 → 09121000100
    N'0912' + RIGHT('0000000' + CAST(1000000 + n AS VARCHAR), 7),

    @Hash,

    -- Gender  (1=Male, 2=Female)
    CAST(CASE WHEN n % 2 = 0 THEN 1 ELSE 2 END AS SMALLINT),

    -- Status  (1=Pending, 2=Active, 3=Suspended)
    CAST(CASE WHEN n % 10 = 8 THEN 1
              WHEN n % 10 = 9 THEN 3
              ELSE                  2
         END AS SMALLINT),

    -- Role  (2=BrokerAdmin, 3=TenantAdmin, 4=TenantStaff)
    CAST(CASE WHEN n % 10 = 0 THEN 2
              WHEN n % 10 = 1 THEN 3
              ELSE                  4
         END AS SMALLINT),

    CAST(2 AS SMALLINT),   -- Language: Persian

    @BrokerId,
    0,                     -- IsRoot
    1,                     -- CreatedByUserId
    GETUTCDATE(),
    NEWID(),
    NULL                   -- AvatarId
FROM nums;

SELECT @@ROWCOUNT AS InsertedRows;